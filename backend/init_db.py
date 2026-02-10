"""
Initialize the Supabase database with tables and seed data.
Run this after setting up a new Supabase project.
Usage: python init_db.py
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# SQL to create tables
CREATE_TABLES_SQL = """
-- Users table
CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    rollno INTEGER NOT NULL,
    answers JSONB DEFAULT NULL,
    score FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    qid INTEGER PRIMARY KEY,
    question TEXT NOT NULL,
    weightage FLOAT DEFAULT 1.0
);

-- Scores table (match pairs)
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    person1 TEXT NOT NULL REFERENCES users(email),
    person2 TEXT NOT NULL REFERENCES users(email),
    number_of_times_matched INTEGER DEFAULT 1,
    score FLOAT DEFAULT 0.0,
    matched_by JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(person1, person2)
);

-- Index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_scores_matched ON scores(number_of_times_matched DESC);

-- Enable Row Level Security (allow all for anon key usage)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all for questions" ON questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all for scores" ON scores FOR ALL USING (true) WITH CHECK (true);
"""

# Questions to seed
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


def execute_sql(sql: str) -> dict:
    """Execute SQL via Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/sql"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    response = requests.post(url, json={"query": sql}, headers=headers)
    if not response.ok:
        raise Exception(f"SQL execution failed: {response.text}")
    return response.json()


def init():
    print("Creating tables...")
    try:
        result = execute_sql(CREATE_TABLES_SQL)
        print("Tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")
        print("Note: You may need to run the SQL manually in Supabase SQL Editor")
        return

    print("\nSeeding questions...")
    from config import supabase
    for q in QUESTIONS:
        try:
            existing = supabase.table("questions").select("*").eq("qid", q["qid"]).execute()
            if existing.data:
                print(f"Question {q['qid']} already exists, skipping.")
                continue
            supabase.table("questions").insert(q).execute()
            print(f"Inserted question {q['qid']}: {q['question'][:40]}...")
        except Exception as e:
            print(f"Error inserting question {q['qid']}: {e}")

    print("\nDone! Database initialized.")


if __name__ == "__main__":
    init()
