"""
Run this once to seed the questions table in Supabase.
Usage: python seed_questions.py
"""
from config import supabase

QUESTIONS = [
    {"qid": 1, "question": "You catch feelings easily.", "weightage": 1.0},
    {"qid": 2, "question": "You will be bored if you spend the weekend by yourself.", "weightage": 1.0},
    {"qid": 3, "question": "You believe career is more important than love (right now).", "weightage": 1.0},
    {"qid": 4, "question": "You're more likely to have a love marriage than arranged marriage.", "weightage": 1.0},
    {"qid": 5, "question": "You tend to keep others at a distance and are hard to get to know.", "weightage": 1.0},
    {"qid": 6, "question": "When it comes to making life changing choices you mostly listen to heart rather than your head.", "weightage": 1.0},
    {"qid": 7, "question": "You like public displays of affection.", "weightage": 1.0},
    {"qid": 8, "question": "You get jealous easily.", "weightage": 1.0},
    {"qid": 9, "question": "You enjoy flirting.", "weightage": 1.0},
    {"qid": 10, "question": "You tend to avoid bustling and crowded events.", "weightage": 1.0},
    {"qid": 11, "question": "You spend a lot of time thinking about past decisions.", "weightage": 1.0},
    {"qid": 12, "question": "You believe love at first sight is real.", "weightage": 1.0},
]


def seed():
    for q in QUESTIONS:
        existing = supabase.table("questions").select("*").eq("qid", q["qid"]).execute()
        if existing.data:
            print(f"Question {q['qid']} already exists, skipping.")
            continue
        result = supabase.table("questions").insert(q).execute()
        print(f"Inserted question {q['qid']}: {result.data}")
    print("Seeding complete!")


if __name__ == "__main__":
    seed()
