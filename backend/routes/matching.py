import time
from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from config import supabase
from models import MatchRequest, MatchResult, compute_batch

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/match", tags=["matching"])

LEADERBOARD_CACHE_TTL = 300  # 5 minutes in seconds
_leaderboard_cache = {
    "couples": {"data": None, "updated_at": 0},
    "users": {"data": None, "updated_at": 0},
}

MATCH_COOLDOWN_SECONDS = 180  # 3 minutes
_last_match_time: dict[str, float] = {}  # email -> timestamp

SAME_PREFERENCE_PENALTY = 7.0  # 7% penalty when both have same preference


def apply_preference_penalty(match_pct: float, user1: dict, user2: dict) -> float:
    """Apply penalty if both users have the same preference.
    If A likes men and B likes women -> assumed straight pair -> no penalty.
    If A and B both like men (or both like women) -> same preference -> penalty.
    """
    pref1 = (user1.get("preference") or "").lower()
    pref2 = (user2.get("preference") or "").lower()
    if pref1 and pref2 and pref1 == pref2:
        match_pct = max(0.0, match_pct - SAME_PREFERENCE_PENALTY)
    return round(match_pct, 2)


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
@limiter.limit("10/minute")
async def make_match(request: Request, req: MatchRequest):
    """
    Match two people using a single DB round-trip via RPC.
    Falls back to multi-query approach if RPC is not available.
    Rate limited to 10 requests/minute per IP.
    """
    if req.person1_email == req.person2_email:
        raise HTTPException(status_code=400, detail="Cannot match a person with themselves")

    # Cooldown check (in-memory, fast)
    now = time.time()
    last = _last_match_time.get(req.matcher_email, 0)
    remaining = MATCH_COOLDOWN_SECONDS - (now - last)
    if remaining > 0:
        mins = int(remaining // 60)
        secs = int(remaining % 60)
        raise HTTPException(
            status_code=429,
            detail=f"Cooldown active. Wait {mins}m {secs}s before your next match."
        )

    # Try RPC first (single DB round-trip)
    try:
        rpc_result = supabase.rpc("perform_match", {
            "p_person1_email": req.person1_email,
            "p_person2_email": req.person2_email,
            "p_matcher_email": req.matcher_email,
        }).execute()

        if rpc_result.data:
            data = rpc_result.data
            status = data.get("status", 200)
            if status != 200:
                raise HTTPException(status_code=status, detail=data.get("error", "Match failed"))

            # Record cooldown timestamp
            _last_match_time[req.matcher_email] = time.time()

            # Invalidate leaderboard cache
            _leaderboard_cache["couples"]["data"] = None
            _leaderboard_cache["users"]["data"] = None

            return MatchResult(
                person1_email=data["person1_email"],
                person2_email=data["person2_email"],
                person1_name=data["person1_name"],
                person2_name=data["person2_name"],
                score=data["score"],
                points=data["points"],
                number_of_times_matched=data["number_of_times_matched"],
                matched_by=data["matched_by"],
            )
    except HTTPException:
        raise
    except Exception:
        pass  # RPC not available, fall back to multi-query

    # Fallback: multi-query approach
    return await _make_match_fallback(req)


async def _make_match_fallback(req: MatchRequest) -> MatchResult:
    """Fallback multi-query match logic if RPC is not deployed."""
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

    # Normalize pair order so (A,B) == (B,A) and person1 < person2
    emails = sorted([req.person1_email, req.person2_email])
    p1_email, p2_email = emails[0], emails[1]

    existing = (
        supabase.table("scores")
        .select("*")
        .eq("person1", p1_email)
        .eq("person2", p2_email)
        .execute()
    )

    if existing.data:
        row = existing.data[0]
        matched_by_list = row.get("matched_by") or []
        if req.matcher_email in matched_by_list:
            raise HTTPException(
                status_code=400,
                detail="You have already matched this pair"
            )

    questions_res = supabase.table("questions").select("*").execute()
    questions = questions_res.data
    match_pct = compute_match_percentage(user1["answers"], user2["answers"], questions)
    match_pct = apply_preference_penalty(match_pct, user1, user2)
    points = match_percentage_to_points(match_pct)

    matcher_res = supabase.table("users").select("score").eq("email", req.matcher_email).execute()
    if matcher_res.data:
        old_score = float(matcher_res.data[0].get("score", 0) or 0)
        supabase.table("users").update(
            {"score": old_score + points}
        ).eq("email", req.matcher_email).execute()

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

    p1_name = user1["name"] if user1["email"] == p1_email else user2["name"]
    p2_name = user2["name"] if user2["email"] == p2_email else user1["name"]

    # Record cooldown timestamp
    _last_match_time[req.matcher_email] = time.time()

    # Invalidate leaderboard cache
    _leaderboard_cache["couples"]["data"] = None
    _leaderboard_cache["users"]["data"] = None

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
    """Top matched couples sorted by number_of_times_matched descending. Cached for 5 min."""
    now = time.time()
    cache = _leaderboard_cache["couples"]
    if cache["data"] is not None and (now - cache["updated_at"]) < LEADERBOARD_CACHE_TTL:
        next_update = int(cache["updated_at"] + LEADERBOARD_CACHE_TTL - now)
        return {"data": cache["data"][:limit], "next_update_in": next_update}

    result = (
        supabase.table("scores")
        .select("*")
        .order("number_of_times_matched", desc=True)
        .limit(limit)
        .execute()
    )

    # Batch-fetch all user names in one query instead of N+1
    all_emails = set()
    for row in result.data:
        all_emails.add(row["person1"])
        all_emails.add(row["person2"])

    name_map = {}
    if all_emails:
        users_res = (
            supabase.table("users")
            .select("email,name")
            .in_("email", list(all_emails))
            .execute()
        )
        for u in users_res.data:
            name_map[u["email"]] = u["name"]

    leaderboard = []
    for row in result.data:
        leaderboard.append({
            "person1_email": row["person1"],
            "person2_email": row["person2"],
            "person1_name": name_map.get(row["person1"], "Unknown"),
            "person2_name": name_map.get(row["person2"], "Unknown"),
            "number_of_times_matched": row["number_of_times_matched"],
            "score": row["score"],
        })

    cache["data"] = leaderboard
    cache["updated_at"] = now
    return {"data": leaderboard, "next_update_in": LEADERBOARD_CACHE_TTL}


@router.get("/leaderboard/users")
async def get_users_leaderboard(limit: int = 20):
    """Top users sorted by their accumulated score. Cached for 5 min."""
    now = time.time()
    cache = _leaderboard_cache["users"]
    if cache["data"] is not None and (now - cache["updated_at"]) < LEADERBOARD_CACHE_TTL:
        next_update = int(cache["updated_at"] + LEADERBOARD_CACHE_TTL - now)
        return {"data": cache["data"][:limit], "next_update_in": next_update}

    result = (
        supabase.table("users")
        .select("email,name,score,year,rollno")
        .order("score", desc=True)
        .limit(limit)
        .execute()
    )
    users = result.data
    for u in users:
        if u.get("year") and u.get("rollno"):
            u["batch"] = compute_batch(u["rollno"], u["year"])

    cache["data"] = users
    cache["updated_at"] = now
    return {"data": users, "next_update_in": LEADERBOARD_CACHE_TTL}


@router.get("/cooldown/{email}")
async def get_cooldown(email: str):
    """Check remaining cooldown for a user."""
    now = time.time()
    last = _last_match_time.get(email, 0)
    remaining = MATCH_COOLDOWN_SECONDS - (now - last)
    if remaining > 0:
        return {"cooldown": True, "remaining_seconds": int(remaining)}
    return {"cooldown": False, "remaining_seconds": 0}
