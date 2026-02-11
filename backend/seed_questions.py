"""
Run this once to seed the questions table in PostgreSQL.
Usage: python seed_questions.py
"""
from config import get_db_cursor

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
    with get_db_cursor() as cursor:
        for q in QUESTIONS:
            cursor.execute("SELECT * FROM questions WHERE qid = %s", (q["qid"],))
            existing = cursor.fetchone()
            if existing:
                print(f"Question {q['qid']} already exists, skipping.")
                continue
            cursor.execute(
                "INSERT INTO questions (qid, question, weightage) VALUES (%s, %s, %s)",
                (q["qid"], q["question"], q["weightage"])
            )
            print(f"Inserted question {q['qid']}")
    print("Seeding complete!")


if __name__ == "__main__":
    seed()
