-- Seed test data for 6 users with quiz answers
-- Run this in the Supabase SQL Editor

-- Anita George (2024, BCS, roll 72)
INSERT INTO users (email, name, year, rollno, gender, preference, answers, score)
VALUES (
  'anitageorge24bcs72@iiitkottayam.ac.in',
  'ANITA GEORGE',
  2024, 72,
  'female', 'men',
  '{"1":7.2,"2":8.1,"3":3.5,"4":9.0,"5":2.8,"6":7.5,"7":6.3,"8":5.0,"9":8.4,"10":3.2,"11":6.7,"12":8.9}',
  0.0
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  preference = EXCLUDED.preference,
  answers = EXCLUDED.answers;

-- Jefin Francis (2023, BCS, roll 53)
INSERT INTO users (email, name, year, rollno, gender, preference, answers, score)
VALUES (
  'jefin23bcs53@iiitkottayam.ac.in',
  'JEFIN FRANCIS',
  2023, 53,
  'male', 'women',
  '{"1":6.0,"2":4.5,"3":7.8,"4":5.2,"5":6.1,"6":4.0,"7":3.5,"8":7.9,"9":5.6,"10":8.3,"11":7.0,"12":3.8}',
  0.0
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  preference = EXCLUDED.preference,
  answers = EXCLUDED.answers;

-- Joswin M J (2024, BCS, roll 53)
INSERT INTO users (email, name, year, rollno, gender, preference, answers, score)
VALUES (
  'joswinj24bcs53@iiitkottayam.ac.in',
  'JOSWIN M J',
  2024, 53,
  'male', 'women',
  '{"1":8.5,"2":7.0,"3":4.2,"4":8.8,"5":3.0,"6":8.0,"7":7.5,"8":6.2,"9":9.1,"10":2.5,"11":5.5,"12":9.0}',
  0.0
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  preference = EXCLUDED.preference,
  answers = EXCLUDED.answers;

-- Muhammed Basil P V (2024, BCD, roll 21)
INSERT INTO users (email, name, year, rollno, gender, preference, answers, score)
VALUES (
  'muhammedv24bcd21@iiitkottayam.ac.in',
  'MUHAMMED BASIL P V',
  2024, 21,
  'male', 'women',
  '{"1":5.0,"2":6.5,"3":8.0,"4":4.5,"5":7.2,"6":3.8,"7":2.5,"8":8.5,"9":4.0,"10":9.0,"11":8.2,"12":2.0}',
  0.0
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  preference = EXCLUDED.preference,
  answers = EXCLUDED.answers;

-- Noel Manoj (2024, BCS, roll 46)
INSERT INTO users (email, name, year, rollno, gender, preference, answers, score)
VALUES (
  'noelmanoj24bcs46@iiitkottayam.ac.in',
  'NOEL MANOJ',
  2024, 46,
  'male', 'women',
  '{"1":7.8,"2":8.5,"3":2.0,"4":9.5,"5":1.5,"6":9.0,"7":8.0,"8":4.5,"9":7.0,"10":3.0,"11":4.8,"12":9.5}',
  0.0
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  preference = EXCLUDED.preference,
  answers = EXCLUDED.answers;

-- Sam Joe Chalissery (2024, BCS, roll 41)
INSERT INTO users (email, name, year, rollno, gender, preference, answers, score)
VALUES (
  'samchalissery24bcs41@iiitkottayam.ac.in',
  'SAM JOE CHALISSERY',
  2024, 41,
  'male', 'women',
  '{"1":6.5,"2":7.8,"3":5.5,"4":7.0,"5":4.0,"6":6.8,"7":5.5,"8":6.0,"9":7.5,"10":4.5,"11":6.0,"12":7.2}',
  0.0
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  preference = EXCLUDED.preference,
  answers = EXCLUDED.answers;
