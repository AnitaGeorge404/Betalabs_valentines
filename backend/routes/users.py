import re
import json
from fastapi import APIRouter, HTTPException
from config import get_db_cursor
from models import UserCreate, AnswerSubmit, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


def parse_email(email: str) -> dict:
    """
    Parse email like 'samchalissery24bcs41@iiitkottayam.ac.in'
    Extract year (24 -> 2024) and roll number (41).
    """
    local_part = email.split("@")[0]
    match = re.search(r"(\d{2})bcs(\d+)$", local_part, re.IGNORECASE)
    if not match:
        match = re.search(r"(\d{2})[a-zA-Z]+(\d+)$", local_part, re.IGNORECASE)
    if not match:
        raise HTTPException(status_code=400, detail="Could not parse year/rollno from email")
    year_short = int(match.group(1))
    rollno = int(match.group(2))
    year = 2000 + year_short
    return {"year": year, "rollno": rollno}


def clean_name(name: str) -> str:
    """Remove '-IIITK' suffix from name."""
    if name.endswith("-IIITK"):
        return name[: -len("-IIITK")].strip()
    return name.strip()


ALLOWED_DOMAIN = "iiitkottayam.ac.in"


@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    """Register a new user after Google Auth sign-in."""
    if not user.email.endswith(f"@{ALLOWED_DOMAIN}"):
        raise HTTPException(
            status_code=403,
            detail=f"Only @{ALLOWED_DOMAIN} emails are allowed"
        )

    with get_db_cursor() as cursor:
        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        existing = cursor.fetchone()
        if existing:
            return existing

        # Parse email and clean name
        parsed = parse_email(user.email)
        cleaned_name = clean_name(user.name)

        # Insert new user
        cursor.execute(
            """
            INSERT INTO users (email, name, year, rollno, answers, score)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (user.email, cleaned_name, parsed["year"], parsed["rollno"], None, 0.0)
        )
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=500, detail="Failed to create user")
        return result


@router.get("/check/{email}")
async def check_user(email: str):
    """Check if user exists and has completed onboarding."""
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return {"exists": False, "onboarded": False}
        onboarded = user.get("answers") is not None
        return {"exists": True, "onboarded": onboarded, "user": dict(user)}


@router.post("/submit-answers")
async def submit_answers(data: AnswerSubmit):
    """Submit quiz answers for a user (onboarding)."""
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            UPDATE users 
            SET answers = %s
            WHERE email = %s
            RETURNING *
            """,
            (json.dumps(data.answers), data.email)
        )
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "Answers saved", "user": dict(result)}


@router.get("/search")
async def search_users(q: str = ""):
    """Search users by name for the match-making page."""
    with get_db_cursor(commit=False) as cursor:
        if not q:
            cursor.execute("SELECT email, name, year, rollno FROM users")
        else:
            cursor.execute(
                "SELECT email, name, year, rollno FROM users WHERE name ILIKE %s",
                (f"%{q}%",)
            )
        return cursor.fetchall()


@router.get("/all")
async def get_all_users():
    """Get all users (for student list in match page)."""
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT email, name, year, rollno FROM users")
        return cursor.fetchall()


@router.get("/{email}", response_model=UserResponse)
async def get_user(email: str):
    """Get a single user's profile."""
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return result
