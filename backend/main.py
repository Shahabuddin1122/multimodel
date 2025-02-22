from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from typing import List
import shutil
import os
import uuid
import chromadb
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import chardet
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RelatedDocumentsRequest(BaseModel):
    model: str
    query: str
    collection_id: str
    top_k: int = 5  # Default to 5 results if not provided


class ChatRequest(BaseModel):
    model: str
    prompt: str


# Initialize Vector Database & Embedding Model
chroma_client = chromadb.PersistentClient(path="chroma_db")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def create_db(file_path, collection_name):
    """Processes a document and stores vector embeddings in a unique collection."""
    with open(file_path, "rb") as f:
        raw_data = f.read()

    # Detect encoding
    encoding_result = chardet.detect(raw_data)
    file_encoding = encoding_result["encoding"] or "utf-8"

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

    # Create a new unique collection for this document
    collection = chroma_client.get_or_create_collection(name=collection_name)

    # Generate embeddings
    embeddings = embedding_model.encode([doc.page_content for doc in texts])

    for i, doc in enumerate(texts):
        collection.add(
            ids=[f"{file_path}_{i}"],
            documents=[doc.page_content],
            embeddings=[embeddings[i]],
            metadatas=[doc.metadata]
        )

    return [doc.page_content for doc in texts]


def get_llm_response(model, related_documents, query):
    llm = ChatOllama(
        model=model,
        temperature=0,
    )

    template = """Relevant Information: {doc}

        Background: You are an expert assistant aiming to provide accurate and concise answers. If the user's 
        question is in English, respond in English. If it's in Bangla, respond in Bangla. Your answer must be 
        strictly based on the 'Relevant Information' above.

        User Query: {user_question}

        (NO PREAMBLE)"""

    prompt_template = PromptTemplate.from_template(template)
    chain = prompt_template | llm
    res = chain.invoke(input={'user_question': query, 'doc': related_documents})
    return res.content


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
    """Uploads a document and stores it in a unique collection."""
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_info = []

    for file in files:
        file_id = str(uuid.uuid4())  # Generate a unique ID
        collection_name = f"document_{file_id}"  # Unique collection name

        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_texts = create_db(file_path, collection_name)

        file_info.append({
            "file_name": file.filename,
            "collection_id": file_id,
            "extracted_texts": extracted_texts
        })

    return {
        "message": "Files uploaded and processed successfully",
        "files": file_info
    }


@app.post("/related-documents")
async def get_related_documents(request: RelatedDocumentsRequest):
    """Retrieve related documents and generate an LLM response using RAG."""
    try:
        collection_name = f"document_{request.collection_id}"
        collection = chroma_client.get_or_create_collection(name=collection_name)

        # Encode query
        query_embedding = embedding_model.encode(request.query)
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=request.top_k
        )

        # Extract related documents
        related_docs = []
        doc_texts = []  # Store retrieved document contents for LLM input

        for i in range(len(results["ids"][0])):
            doc_text = results["documents"][0][i]
            related_docs.append({
                "id": results["ids"][0][i],
                "content": doc_text,
                "metadata": results["metadatas"][0][i]
            })
            doc_texts.append(doc_text)

        combined_docs = "\n\n".join(doc_texts)

        llm_response = get_llm_response(request.model, combined_docs, request.query)

        return {
            "query": request.query,
            "related_documents": related_docs,
            "llm_response": llm_response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))