from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    email: str
    name: str


class AnswerSubmit(BaseModel):
    email: str
    answers: dict[str, float]  # { "qid": score }


class MatchRequest(BaseModel):
    person1_email: str
    person2_email: str
    matcher_email: str  # the logged-in user making the match


class UserResponse(BaseModel):
    email: str
    name: str
    year: int
    rollno: int
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
