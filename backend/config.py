import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

load_dotenv()

# Database configuration
DATABASE_URL: str = os.getenv("DATABASE_URL")

# Create a connection pool (min 2, max 10 connections)
connection_pool = None

def init_db_pool():
    """Initialize the database connection pool."""
    global connection_pool
    if connection_pool is None:
        connection_pool = psycopg2.pool.SimpleConnectionPool(
            2,  # minconn
            10,  # maxconn
            DATABASE_URL
        )

@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    Returns a connection from the pool and ensures it's returned after use.
    """
    if connection_pool is None:
        init_db_pool()
    
    conn = connection_pool.getconn()
    try:
        yield conn
    finally:
        connection_pool.putconn(conn)

@contextmanager
def get_db_cursor(commit=True):
    """
    Context manager for database cursors with automatic commit/rollback.
    Returns a RealDictCursor that returns results as dictionaries.
    """
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cursor
            if commit:
                conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
