import re
from fastapi import APIRouter, HTTPException
from config import supabase
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

    existing = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing.data:
        return existing.data[0]

    parsed = parse_email(user.email)
    cleaned_name = clean_name(user.name)

    new_user = {
        "email": user.email,
        "name": cleaned_name,
        "year": parsed["year"],
        "rollno": parsed["rollno"],
        "answers": None,
        "score": 0.0,
    }
    result = supabase.table("users").insert(new_user).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return result.data[0]


@router.get("/check/{email}")
async def check_user(email: str):
    """Check if user exists and has completed onboarding."""
    result = supabase.table("users").select("*").eq("email", email).execute()
    if not result.data:
        return {"exists": False, "onboarded": False}
    user = result.data[0]
    onboarded = user.get("answers") is not None
    return {"exists": True, "onboarded": onboarded, "user": user}


@router.post("/submit-answers")
async def submit_answers(data: AnswerSubmit):
    """Submit quiz answers for a user (onboarding)."""
    result = (
        supabase.table("users")
        .update({"answers": data.answers})
        .eq("email", data.email)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Answers saved", "user": result.data[0]}


@router.get("/search")
async def search_users(q: str = ""):
    """Search users by name for the match-making page."""
    if not q:
        result = supabase.table("users").select("email,name,year,rollno").execute()
    else:
        result = (
            supabase.table("users")
            .select("email,name,year,rollno")
            .ilike("name", f"%{q}%")
            .execute()
        )
    return result.data


@router.get("/all")
async def get_all_users():
    """Get all users (for student list in match page)."""
    result = supabase.table("users").select("email,name,year,rollno").execute()
    return result.data


@router.get("/{email}", response_model=UserResponse)
async def get_user(email: str):
    """Get a single user's profile."""
    result = supabase.table("users").select("*").eq("email", email).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]
