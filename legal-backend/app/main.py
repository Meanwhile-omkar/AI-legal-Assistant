from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analyze
from app.api import analyze, documents 
from app.api import analyze, documents, questions

app = FastAPI(title="Indian Legal Assistance Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "legal-backend"}

app.include_router(analyze.router)
app.include_router(documents.router) 
app.include_router(questions.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)