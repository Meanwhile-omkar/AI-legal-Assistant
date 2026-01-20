from fastapi import APIRouter
from pydantic import BaseModel
from app.services.question_engine import question_engine

router = APIRouter()

class QuestionRequest(BaseModel):
    case_data: dict

@router.post("/questions/generate")
async def get_questions(request: QuestionRequest):
    return await question_engine.generate_flashcards(request.case_data)