from pydantic import BaseModel
from typing import Optional


def compute_batch(rollno: int, year: int) -> int:
    """Compute batch number from roll number and year.
    2024/2025: 4 batches (rollno % 4 -> 0=1, 1=2, 2=3, 3=4)
    2023: 2 batches (rollno % 2 -> 0=1, 1=2)
    """
    if year == 2023:
        return (rollno % 2) + 1
    return (rollno % 4) + 1


class UserCreate(BaseModel):
    email: str
    name: str


class AnswerSubmit(BaseModel):
    email: str
    answers: dict[str, float]  # { "qid": score }
    gender: str  # "male" or "female"
    preference: str  # "men" or "women"


class MatchRequest(BaseModel):
    person1_email: str
    person2_email: str
    matcher_email: str  # the logged-in user making the match


class UserResponse(BaseModel):
    email: str
    name: str
    year: Optional[int] = None
    rollno: Optional[int] = None
    batch: Optional[int] = None
    gender: Optional[str] = None
    preference: Optional[str] = None
    answers: Optional[dict] = None
    score: Optional[float] = 0.0


class QuestionResponse(BaseModel):
    qid: int
    question: str
    weightage: float


class MatchResult(BaseModel):
    person1_email: str
    person2_email: str
    person1_name: str
    person2_name: str
    score: float
    points: int
    number_of_times_matched: int
    matched_by: list[str] = []


class LeaderboardEntry(BaseModel):
    person1_email: str
    person2_email: str
    person1_name: str
    person2_name: str
    number_of_times_matched: int
    score: float


class UserScoreEntry(BaseModel):
    email: str
    name: str
    score: float
    year: Optional[int] = None
    batch: Optional[int] = None
