-- Scaling & integrity migration
-- Run this in the Supabase SQL Editor

-- 1. Add CHECK constraint: person1 must be < person2 (alphabetical order)
ALTER TABLE scores ADD CONSTRAINT scores_ordered_pair CHECK (person1 < person2);

-- 2. Add index on users(name) for fast ILIKE search
CREATE INDEX IF NOT EXISTS idx_users_name ON users USING gin (name gin_trgm_ops);
-- NOTE: gin_trgm_ops requires the pg_trgm extension. Enable it first:
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Then re-run the index:
-- CREATE INDEX IF NOT EXISTS idx_users_name ON users USING gin (name gin_trgm_ops);

-- Fallback: simple btree index if pg_trgm is not available
CREATE INDEX IF NOT EXISTS idx_users_name_btree ON users (name);

-- 3. Add index on users(score) for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_users_score ON users (score DESC);


-- 4. RPC: perform_match - single round-trip stored procedure for matching
CREATE OR REPLACE FUNCTION perform_match(
    p_person1_email TEXT,
    p_person2_email TEXT,
    p_matcher_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_user1 RECORD;
    v_user2 RECORD;
    v_matcher RECORD;
    v_questions JSON;
    v_existing RECORD;
    v_p1 TEXT;
    v_p2 TEXT;
    v_match_pct FLOAT;
    v_pref1 TEXT;
    v_pref2 TEXT;
    v_penalty FLOAT := 7.0;
    v_points INT;
    v_times_matched INT;
    v_matched_by JSONB;
    v_q RECORD;
    v_qid TEXT;
    v_a1 FLOAT;
    v_a2 FLOAT;
    v_diff FLOAT;
    v_sum_pct FLOAT := 0;
    v_count INT := 0;
BEGIN
    -- Validate not same person
    IF p_person1_email = p_person2_email THEN
        RETURN json_build_object('error', 'Cannot match a person with themselves', 'status', 400);
    END IF;

    -- Fetch both users and matcher in one go
    SELECT * INTO v_user1 FROM users WHERE email = p_person1_email;
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Person 1 not found', 'status', 404);
    END IF;

    SELECT * INTO v_user2 FROM users WHERE email = p_person2_email;
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Person 2 not found', 'status', 404);
    END IF;

    IF v_user1.answers IS NULL OR v_user2.answers IS NULL THEN
        RETURN json_build_object('error', 'Both users must complete onboarding quiz first', 'status', 400);
    END IF;

    -- Normalize pair order
    IF p_person1_email < p_person2_email THEN
        v_p1 := p_person1_email;
        v_p2 := p_person2_email;
    ELSE
        v_p1 := p_person2_email;
        v_p2 := p_person1_email;
    END IF;

    -- Check existing score row and if matcher already matched
    SELECT * INTO v_existing FROM scores WHERE person1 = v_p1 AND person2 = v_p2;
    IF FOUND THEN
        IF v_existing.matched_by ? p_matcher_email THEN
            RETURN json_build_object('error', 'You have already matched this pair', 'status', 400);
        END IF;
    END IF;

    -- Compute match percentage from questions
    FOR v_q IN SELECT qid FROM questions LOOP
        v_qid := v_q.qid::TEXT;
        v_a1 := COALESCE((v_user1.answers ->> v_qid)::FLOAT, 5.0);
        v_a2 := COALESCE((v_user2.answers ->> v_qid)::FLOAT, 5.0);
        v_diff := ABS(v_a1 - v_a2);
        v_sum_pct := v_sum_pct + ((10.0 - v_diff) / 10.0) * 100.0;
        v_count := v_count + 1;
    END LOOP;

    IF v_count > 0 THEN
        v_match_pct := ROUND((v_sum_pct / v_count)::NUMERIC, 2);
    ELSE
        v_match_pct := 0;
    END IF;

    -- Apply preference penalty
    v_pref1 := LOWER(COALESCE(v_user1.preference, ''));
    v_pref2 := LOWER(COALESCE(v_user2.preference, ''));
    IF v_pref1 != '' AND v_pref2 != '' AND v_pref1 = v_pref2 THEN
        v_match_pct := GREATEST(0, v_match_pct - v_penalty);
    END IF;

    -- Convert to points
    IF v_match_pct >= 95 THEN v_points := 5;
    ELSIF v_match_pct >= 85 THEN v_points := 4;
    ELSIF v_match_pct >= 75 THEN v_points := 3;
    ELSIF v_match_pct >= 65 THEN v_points := 2;
    ELSIF v_match_pct >= 55 THEN v_points := 1;
    ELSE v_points := 0;
    END IF;

    -- Update matcher score
    UPDATE users SET score = score + v_points WHERE email = p_matcher_email;

    -- Upsert scores table
    IF FOUND AND v_existing IS NOT NULL AND v_existing.id IS NOT NULL THEN
        v_matched_by := v_existing.matched_by || to_jsonb(p_matcher_email);
        v_times_matched := v_existing.number_of_times_matched + 1;
        UPDATE scores
        SET number_of_times_matched = v_times_matched,
            score = v_match_pct,
            matched_by = v_matched_by
        WHERE person1 = v_p1 AND person2 = v_p2;
    ELSE
        v_matched_by := jsonb_build_array(p_matcher_email);
        v_times_matched := 1;
        INSERT INTO scores (person1, person2, number_of_times_matched, score, matched_by)
        VALUES (v_p1, v_p2, 1, v_match_pct, v_matched_by);
    END IF;

    -- Return result
    RETURN json_build_object(
        'person1_email', v_p1,
        'person2_email', v_p2,
        'person1_name', CASE WHEN v_user1.email = v_p1 THEN v_user1.name ELSE v_user2.name END,
        'person2_name', CASE WHEN v_user2.email = v_p2 THEN v_user2.name ELSE v_user1.name END,
        'score', v_match_pct,
        'points', v_points,
        'number_of_times_matched', v_times_matched,
        'matched_by', v_matched_by,
        'status', 200
    );
END;
$$;
