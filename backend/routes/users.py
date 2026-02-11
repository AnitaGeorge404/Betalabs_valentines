import re
from fastapi import APIRouter, HTTPException
from config import supabase
from models import UserCreate, AnswerSubmit, UserResponse, compute_batch

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

    existing = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing.data:
        row = existing.data[0]
        if row.get("year") and row.get("rollno"):
            row["batch"] = compute_batch(row["rollno"], row["year"])
        return row

    # Try to parse year/rollno, default to None if fails
    try:
        parsed = parse_email(user.email)
        year = parsed["year"]
        rollno = parsed["rollno"]
    except HTTPException:
        year = None
        rollno = None

    cleaned_name = clean_name(user.name)

    new_user = {
        "email": user.email,
        "name": cleaned_name,
        "year": year,
        "rollno": rollno,
        "answers": None,
        "score": 0.0,
    }
    result = supabase.table("users").insert(new_user).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    row = result.data[0]
    if row.get("year") and row.get("rollno"):
        row["batch"] = compute_batch(row["rollno"], row["year"])
    return row


@router.get("/check/{email}")
async def check_user(email: str):
    """Check if user exists and has completed onboarding."""
    result = supabase.table("users").select("*").eq("email", email).execute()
    if not result.data:
        return {"exists": False, "onboarded": False}
    user = result.data[0]
    if user.get("year") and user.get("rollno"):
        user["batch"] = compute_batch(user["rollno"], user["year"])
    onboarded = user.get("answers") is not None
    return {"exists": True, "onboarded": onboarded, "user": user}


@router.post("/submit-answers")
async def submit_answers(data: AnswerSubmit):
    """Submit quiz answers, gender, and preference for a user (onboarding)."""
    result = (
        supabase.table("users")
        .update({
            "answers": data.answers,
            "gender": data.gender,
            "preference": data.preference,
        })
        .eq("email", data.email)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Answers saved", "user": result.data[0]}


@router.get("/search")
async def search_users(q: str = "", limit: int = 15):
    """Search users by name for the match-making page. Returns max `limit` results."""
    if not q or len(q.strip()) < 2:
        return []
    result = (
        supabase.table("users")
        .select("email,name,year,rollno")
        .ilike("name", f"%{q}%")
        .limit(limit)
        .execute()
    )
    users = result.data
    for u in users:
        if u.get("year") and u.get("rollno"):
            u["batch"] = compute_batch(u["rollno"], u["year"])
    return users


@router.get("/{email}", response_model=UserResponse)
async def get_user(email: str):
    """Get a single user's profile."""
    result = supabase.table("users").select("*").eq("email", email).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    row = result.data[0]
    if row.get("year") and row.get("rollno"):
        row["batch"] = compute_batch(row["rollno"], row["year"])
    return row
