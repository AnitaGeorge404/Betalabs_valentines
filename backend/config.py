import os
from dotenv import load_dotenv
from psycopg_pool import ConnectionPool
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
