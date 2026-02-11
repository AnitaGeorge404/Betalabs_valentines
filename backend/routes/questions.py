from fastapi import APIRouter, HTTPException
from config import get_db_cursor

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("/")
async def get_all_questions():
    """Fetch all questions for the onboarding quiz."""
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT * FROM questions ORDER BY qid")
        return cursor.fetchall()


@router.get("/{qid}")
async def get_question(qid: int):
    """Fetch a single question by qid."""
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT * FROM questions WHERE qid = %s", (qid,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Question not found")
        return result
