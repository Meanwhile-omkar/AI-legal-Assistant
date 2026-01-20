from fastapi import APIRouter
from pydantic import BaseModel
from app.services.doc_engine import doc_engine

router = APIRouter()

class DocRequest(BaseModel):
    case_data: dict
    selected_doc: str = None

@router.post("/documents/suggest")
async def suggest(request: DocRequest):
    suggestions = await doc_engine.suggest_documents(request.case_data)
    return suggestions

@router.post("/documents/generate")
async def generate(request: DocRequest):
    if not request.selected_doc:
        return {"error": "No document type selected"}
    content = await doc_engine.generate_content(request.case_data, request.selected_doc)
    return content