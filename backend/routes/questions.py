from fastapi import APIRouter, HTTPException
from config import supabase

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("/")
async def get_all_questions():
    """Fetch all questions for the onboarding quiz."""
    result = supabase.table("questions").select("*").order("qid").execute()
    return result.data


@router.get("/{qid}")
async def get_question(qid: int):
    """Fetch a single question by qid."""
    result = supabase.table("questions").select("*").eq("qid", qid).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Question not found")
    return result.data[0]
