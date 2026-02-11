-- Run this in the Supabase SQL Editor to create all required tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year INTEGER,
    rollno INTEGER,
    gender TEXT DEFAULT NULL,
    preference TEXT DEFAULT NULL,
    answers JSONB DEFAULT NULL,
    score FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: add gender/preference columns if table already exists
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT NULL;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS preference TEXT DEFAULT NULL;

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

CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for questions" ON questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for scores" ON scores FOR ALL USING (true) WITH CHECK (true);

-- Seed questions
INSERT INTO questions (qid, question, weightage) VALUES
(1, 'You catch feelings easily.', 1.0),
(2, 'You will be bored if you spend the weekend by yourself.', 1.0),
(3, 'You believe career is more important than love (right now).', 1.0),
(4, 'You''re more likely to have a love marriage than arranged marriage.', 1.0),
(5, 'You tend to keep others at a distance and are hard to get to know.', 1.0),
(6, 'When it comes to making life changing choices you mostly listen to heart rather than your head.', 1.0),
(7, 'You like public displays of affection.', 1.0),
(8, 'You get jealous easily.', 1.0),
(9, 'You enjoy flirting.', 1.0),
(10, 'You tend to avoid bustling and crowded events.', 1.0),
(11, 'You spend a lot of time thinking about past decisions.', 1.0),
(12, 'You believe love at first sight is real.', 1.0)
ON CONFLICT (qid) DO NOTHING;
