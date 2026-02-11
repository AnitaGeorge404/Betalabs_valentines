import os
from dotenv import load_dotenv
from psycopg_pool import ConnectionPool
from contextlib import contextmanager

load_dotenv()

# Database configuration
DATABASE_URL: str = os.getenv("DATABASE_URL")

# OAuth / JWT configuration (set these in your environment)
GOOGLE_OAUTH_CLIENT_ID: str = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET: str = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
OAUTH_REDIRECT_URI: str = os.getenv("OAUTH_REDIRECT_URI")
ALLOWED_DOMAIN: str = os.getenv("ALLOWED_DOMAIN", "iiitkottayam.ac.in")

# Frontend URL to redirect to after OAuth callback (e.g. http://localhost:5173)
FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

# JWT settings for issuing short-lived tokens to the frontend
JWT_SECRET: str = os.getenv("JWT_SECRET", "please-change-me")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

# Create a connection pool (min 2, max 10 connections)
connection_pool = None

def init_db_pool():
    """Initialize the database connection pool."""
    global connection_pool
    if connection_pool is None:
        connection_pool = ConnectionPool(
            conninfo=DATABASE_URL,
            min_size=2,
            max_size=10,
            open=True
        )

@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    Returns a connection from the pool and ensures it's returned after use.
    """
    if connection_pool is None:
        init_db_pool()
    
    with connection_pool.connection() as conn:
        yield conn

@contextmanager
def get_db_cursor(commit=True):
    """
    Context manager for database cursors with automatic commit/rollback.
    Returns a cursor that returns results as dictionaries (row_factory).
    """
    with get_db_connection() as conn:
        # Set row_factory to return dict-like rows
        from psycopg.rows import dict_row
        conn.row_factory = dict_row
        
        cursor = conn.cursor()
        try:
            yield cursor
            if commit:
                conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
