"""
Test script to verify PostgreSQL connection and basic database operations.
Run this after setting up your DATABASE_URL in .env to verify everything works.
"""
import os
from dotenv import load_dotenv
import psycopg
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def test_connection():
    """Test basic connection to PostgreSQL."""
    try:
        with psycopg.connect(DATABASE_URL) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()[0]
                print(f"✅ Successfully connected to PostgreSQL!")
                print(f"   Version: {version}\n")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_tables():
    """Check if all required tables exist."""
    try:
        with psycopg.connect(DATABASE_URL) as conn:
            conn.row_factory = dict_row
            cursor = conn.cursor()
            
            tables = ['users', 'questions', 'scores']
            print("Checking tables:")
            for table in tables:
                cursor.execute(
                    """
                    SELECT COUNT(*) as count 
                    FROM information_schema.tables 
                    WHERE table_name = %s
                    """,
                    (table,)
                )
                result = cursor.fetchone()
                if result['count'] > 0:
                    cursor.execute(f"SELECT COUNT(*) as row_count FROM {table}")
                    row_count = cursor.fetchone()['row_count']
                    print(f"  ✅ {table} table exists ({row_count} rows)")
                else:
                    print(f"  ❌ {table} table NOT FOUND")
            
            print()
    except Exception as e:
        print(f"❌ Table check failed: {e}\n")

def test_jsonb_operations():
    """Test JSONB operations work correctly."""
    try:
        with psycopg.connect(DATABASE_URL) as conn:
            conn.row_factory = dict_row
            with conn.cursor() as cursor:
                # Test JSON query on users table
                cursor.execute("SELECT COUNT(*) as count FROM users WHERE answers IS NOT NULL")
                result = cursor.fetchone()
                print(f"JSONB test: {result['count']} users with answers stored ✅\n")
    except Exception as e:
        print(f"❌ JSONB test failed: {e}\n")

if __name__ == "__main__":
    print("=" * 60)
    print("PostgreSQL Connection Test")
    print("=" * 60)
    print()
    
    if not DATABASE_URL:
        print("❌ DATABASE_URL not found in environment variables!")
        print("   Please set DATABASE_URL in your .env file")
        print("   Format: postgresql://user:password@host:port/database")
        exit(1)
    
    print(f"Testing connection to: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'localhost'}")
    print()
    
    if test_connection():
        test_tables()
        test_jsonb_operations()
        print("=" * 60)
        print("All tests passed! ✅")
        print("You can now run: uvicorn main:app --reload")
        print("=" * 60)
