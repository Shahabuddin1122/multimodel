from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from typing import List
import shutil
import os
import chromadb
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import chardet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vector Database & Model
chroma_client = chromadb.PersistentClient(path="chroma_db")
collection = chroma_client.get_or_create_collection(name="documents")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def create_db(file_path):
    """Processes a document and stores vector embeddings."""
    with open(file_path, "rb") as f:  # Read in binary mode
        raw_data = f.read()

    # Detect encoding
    encoding_result = chardet.detect(raw_data)
    file_encoding = encoding_result["encoding"] or "utf-8"  # Default to utf-8 if unknown

    try:
        text = raw_data.decode(file_encoding)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File encoding not supported")

    # Convert to LangChain Document format
    document = Document(page_content=text, metadata={"source": file_path})

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=250
    )
    texts = text_splitter.split_documents([document])

    # Generate embeddings
    embeddings = embedding_model.encode([doc.page_content for doc in texts])

    for i, doc in enumerate(texts):
        collection.add(
            ids=[f"{file_path}_{i}"],  # Unique ID
            documents=[doc.page_content],
            embeddings=[embeddings[i]],
            metadatas=[doc.metadata]  # Store file info
        )
    return [doc.page_content for doc in texts]


class ChatRequest(BaseModel):
    model: str
    prompt: str


@app.post("/chat")
async def chat(request: ChatRequest):
    """Handles AI chat requests."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/v1/chat/completions",
                json={
                    "model": request.model,
                    "messages": [{"role": "user", "content": request.prompt}]
                }
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"message": "Hello"}


@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_texts = {}

    for file in files:
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_texts = create_db(file_path)
        file_texts[file.filename] = extracted_texts

    return {
        "message": "Files uploaded and processed successfully",
        "extracted_texts": file_texts
    }
