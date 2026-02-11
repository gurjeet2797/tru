import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router

load_dotenv()

app = FastAPI(title="Tru", version="0.1.0")

# CORS: allow Vercel production domain + local dev.
allowed_origins = [
    "https://tru-liard.vercel.app",
    "http://localhost:8081",
    "http://localhost:8083",
    "http://localhost:19006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.get("/")
def root():
    return {"message": "Tru API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    return {"status": "ok"}
