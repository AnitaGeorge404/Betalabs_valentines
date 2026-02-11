-- Make year and rollno nullable in users table
ALTER TABLE users ALTER COLUMN year DROP NOT NULL;
ALTER TABLE users ALTER COLUMN rollno DROP NOT NULL;
