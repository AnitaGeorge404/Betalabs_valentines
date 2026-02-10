from fastapi import APIRouter, HTTPException
from config import supabase
from models import MatchRequest, MatchResult

router = APIRouter(prefix="/match", tags=["matching"])


def compute_match_percentage(answers1: dict, answers2: dict, questions: list) -> float:
    """
    For each question, take |person1_answer - person2_answer|.
    Per-question match % = ((10 - diff) / 10) * 100
    Overall match % = average of all per-question percentages.
    """
    if not answers1 or not answers2:
        return 0.0

    question_percentages = []
    for q in questions:
        qid = str(q["qid"])
        a1 = float(answers1.get(qid, 5.0))
        a2 = float(answers2.get(qid, 5.0))
        diff = abs(a1 - a2)
        pct = ((10.0 - diff) / 10.0) * 100.0
        question_percentages.append(pct)

    if not question_percentages:
        return 0.0

    return round(sum(question_percentages) / len(question_percentages), 2)


def match_percentage_to_points(pct: float) -> int:
    """
    55-64% -> 1 pt, 65-74% -> 2 pts, 75-84% -> 3 pts,
    85-94% -> 4 pts, 95-100% -> 5 pts, below 55% -> 0 pts
    """
    if pct >= 95:
        return 5
    if pct >= 85:
        return 4
    if pct >= 75:
        return 3
    if pct >= 65:
        return 2
    if pct >= 55:
        return 1
    return 0


@router.post("/make", response_model=MatchResult)
async def make_match(req: MatchRequest):
    """
    Match two people:
    1. Check if this matcher already matched this pair (prevent duplicates)
    2. Compute match percentage (diff-based)
    3. Convert to points, update matcher's score
    4. Upsert scores table, append matcher to matched_by array
    """
    if req.person1_email == req.person2_email:
        raise HTTPException(status_code=400, detail="Cannot match a person with themselves")

    user1_res = supabase.table("users").select("*").eq("email", req.person1_email).execute()
    user2_res = supabase.table("users").select("*").eq("email", req.person2_email).execute()

    if not user1_res.data:
        raise HTTPException(status_code=404, detail="Person 1 not found")
    if not user2_res.data:
        raise HTTPException(status_code=404, detail="Person 2 not found")

    user1 = user1_res.data[0]
    user2 = user2_res.data[0]

    if not user1.get("answers") or not user2.get("answers"):
        raise HTTPException(
            status_code=400, detail="Both users must complete onboarding quiz first"
        )

    # Normalize pair order so (A,B) == (B,A)
    emails = sorted([req.person1_email, req.person2_email])
    p1_email, p2_email = emails[0], emails[1]

    # Check if this pair already exists
    existing = (
        supabase.table("scores")
        .select("*")
        .eq("person1", p1_email)
        .eq("person2", p2_email)
        .execute()
    )

    # Check if this matcher already matched this pair
    if existing.data:
        row = existing.data[0]
        matched_by_list = row.get("matched_by") or []
        if req.matcher_email in matched_by_list:
            raise HTTPException(
                status_code=400,
                detail="You have already matched this pair"
            )

    # Compute score
    questions_res = supabase.table("questions").select("*").execute()
    questions = questions_res.data
    match_pct = compute_match_percentage(user1["answers"], user2["answers"], questions)
    points = match_percentage_to_points(match_pct)

    # Update the matcher's score (the person who made the match gets points)
    matcher_res = supabase.table("users").select("score").eq("email", req.matcher_email).execute()
    if matcher_res.data:
        old_score = float(matcher_res.data[0].get("score", 0) or 0)
        supabase.table("users").update(
            {"score": old_score + points}
        ).eq("email", req.matcher_email).execute()

    # Upsert scores table
    if existing.data:
        row = existing.data[0]
        matched_by_list = row.get("matched_by") or []
        matched_by_list.append(req.matcher_email)
        new_count = row["number_of_times_matched"] + 1
        supabase.table("scores").update({
            "number_of_times_matched": new_count,
            "score": match_pct,
            "matched_by": matched_by_list,
        }).eq("person1", p1_email).eq("person2", p2_email).execute()
        times_matched = new_count
    else:
        matched_by_list = [req.matcher_email]
        supabase.table("scores").insert({
            "person1": p1_email,
            "person2": p2_email,
            "number_of_times_matched": 1,
            "score": match_pct,
            "matched_by": matched_by_list,
        }).execute()
        times_matched = 1

    # Resolve names for the sorted order
    p1_name = user1["name"] if user1["email"] == p1_email else user2["name"]
    p2_name = user2["name"] if user2["email"] == p2_email else user1["name"]

    return MatchResult(
        person1_email=p1_email,
        person2_email=p2_email,
        person1_name=p1_name,
        person2_name=p2_name,
        score=match_pct,
        points=points,
        number_of_times_matched=times_matched,
        matched_by=matched_by_list,
    )


@router.get("/leaderboard/couples")
async def get_couples_leaderboard(limit: int = 20):
    """Top matched couples sorted by number_of_times_matched descending."""
    result = (
        supabase.table("scores")
        .select("*")
        .order("number_of_times_matched", desc=True)
        .limit(limit)
        .execute()
    )

    leaderboard = []
    for row in result.data:
        u1 = supabase.table("users").select("name").eq("email", row["person1"]).execute()
        u2 = supabase.table("users").select("name").eq("email", row["person2"]).execute()
        leaderboard.append({
            "person1_email": row["person1"],
            "person2_email": row["person2"],
            "person1_name": u1.data[0]["name"] if u1.data else "Unknown",
            "person2_name": u2.data[0]["name"] if u2.data else "Unknown",
            "number_of_times_matched": row["number_of_times_matched"],
            "score": row["score"],
        })

    return leaderboard


@router.get("/leaderboard/users")
async def get_users_leaderboard(limit: int = 20):
    """Top users sorted by their accumulated score (successful matching points)."""
    result = (
        supabase.table("users")
        .select("email,name,score")
        .order("score", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data
