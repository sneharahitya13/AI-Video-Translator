from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="AI Multilingual Video Translator",
    description="Backend API for translating videos into multiple languages",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "THIS IS MY NEW SERVER",
        "status": "TEST"
    }

@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }