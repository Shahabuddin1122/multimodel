from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx

app = FastAPI()


class ChatRequest(BaseModel):
    model: str
    prompt: str


@app.post("/chat")
async def chat(request: ChatRequest):
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
