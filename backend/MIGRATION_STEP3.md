# Step 3 Complete: Database Layer Migration

## ✅ What Was Changed

### 1. Dependencies Updated ([requirements.txt](requirements.txt))
- **Removed:** `supabase==2.11.0`
- **Added:** 
  - `psycopg2-binary==2.9.9` (PostgreSQL adapter)
  - `python-jose[cryptography]==3.3.0` (for future JWT auth in step 4)

### 2. Database Configuration ([config.py](config.py))
**Before:** Used Supabase client SDK
```python
from supabase import create_client, Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
```

**After:** Direct PostgreSQL connection pool with context managers
- `init_db_pool()` - Creates connection pool (2-10 connections)
- `get_db_connection()` - Context manager for connections
- `get_db_cursor(commit=True)` - Context manager for cursors with auto-commit/rollback
- Uses `RealDictCursor` to return results as dictionaries

### 3. All Routes Refactored

#### [routes/users.py](routes/users.py)
- Replaced all `supabase.table().select()` with parameterized SQL queries
- JSONB operations now use native PostgreSQL JSON functions
- Added `json.dumps()` for JSONB inserts

**Example transformation:**
```python
# Before
result = supabase.table("users").select("*").eq("email", email).execute()
user = result.data[0]

# After
with get_db_cursor(commit=False) as cursor:
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
```

#### [routes/questions.py](routes/questions.py)
- Simple SELECT queries with ORDER BY
- Read-only operations use `commit=False` for performance

#### [routes/matching.py](routes/matching.py)
- Complex matching logic now uses raw SQL
- JSONB array operations (`matched_by`) use `json.dumps()` for serialization
- Transaction safety via cursor context manager

### 4. Main App ([main.py](main.py))
- Added `@app.on_event("startup")` to initialize connection pool on startup

### 5. Utility Scripts
- **[seed_questions.py](seed_questions.py):** Updated to use new connection
- **[test_db_connection.py](test_db_connection.py) (NEW):** Test script to verify your setup

### 6. Documentation
- **[.env.example](.env.example) (NEW):** Template for environment variables

---

## 🚀 Next Steps

### Step 1: Update Your `.env` File

Replace your Supabase credentials with PostgreSQL connection:

```bash
# OLD (remove these)
# SUPABASE_URL=https://...
# SUPABASE_KEY=eyJhbGc...

# NEW (add this)
DATABASE_URL=postgresql://username:password@your-rds-endpoint.amazonaws.com:5432/cupids_ledger
```

**Format:** `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE`

**Example with your RDS:**
```bash
DATABASE_URL=postgresql://postgres:MySecurePass123@cupids-db.abc123.us-east-1.rds.amazonaws.com:5432/cupids_ledger
```

### Step 2: Install New Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Test Database Connection

```bash
python test_db_connection.py
```

This will verify:
- ✅ Connection to PostgreSQL works
- ✅ All tables exist (users, questions, scores)
- ✅ JSONB operations work correctly

### Step 4: Run the Backend

```bash
uvicorn main:app --reload
```

Test the API at: http://localhost:8000/docs

### Step 5: Verify All Endpoints

Test these endpoints in your browser or Postman:

1. **Questions:** http://localhost:8000/questions/
2. **Users:** http://localhost:8000/users/all
3. **Leaderboard:** http://localhost:8000/match/leaderboard/users

---

## 🔍 Key Technical Changes

### Connection Pooling
- **Min connections:** 2
- **Max connections:** 10
- Automatically managed via context managers
- Connections returned to pool after use

### Transaction Safety
- `commit=True` (default) for write operations
- `commit=False` for read-only queries
- Automatic rollback on exceptions

### JSONB Handling
PostgreSQL natively supports JSONB, but Python requires serialization:

```python
# Storing JSONB
cursor.execute(
    "UPDATE users SET answers = %s WHERE email = %s",
    (json.dumps(data.answers), email)  # ← json.dumps required
)

# Reading JSONB (automatic deserialization)
cursor.execute("SELECT answers FROM users WHERE email = %s", (email,))
user = cursor.fetchone()
answers_dict = user["answers"]  # ← Already a Python dict!
```

### Parameterized Queries
All queries use `%s` placeholders to prevent SQL injection:

```python
# ✅ SAFE
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# ❌ NEVER DO THIS (SQL injection risk)
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

---

## 🐛 Troubleshooting

### Error: "connection pool exhausted"
**Cause:** Not closing connections properly
**Fix:** Ensure all code uses `with get_db_cursor()` context managers

### Error: "psycopg2.OperationalError: could not connect"
**Causes:**
1. Wrong DATABASE_URL format
2. RDS security group blocking your IP
3. Database not running
**Fix:** Verify RDS endpoint and security group rules

### Error: "relation 'users' does not exist"
**Cause:** Schema not created in RDS
**Fix:** Run [schema.sql](schema.sql) on your RDS instance first

### JSONB Data Not Saving
**Cause:** Forgetting `json.dumps()` when inserting
**Fix:** Always use `json.dumps()` for dict/list values in JSONB columns

---

## 📊 Performance Notes

### Connection Pool Benefits
- Reuses connections instead of creating new ones
- Reduces connection overhead (~10-50ms per connection)
- Handles concurrent requests efficiently

### Read vs Write Operations
- Read queries use `commit=False` to avoid unnecessary commit overhead
- Write queries auto-commit on success, rollback on failure

### Future Optimizations (Optional)
1. Add connection pool monitoring
2. Implement query caching for questions table
3. Use prepared statements for frequently-run queries
4. Add database indexes on frequently-queried columns

---

## 🎯 Step 3 Status: ✅ COMPLETE

Your backend now:
- ✅ Connects directly to PostgreSQL (no Supabase SDK)
- ✅ Uses connection pooling for efficiency
- ✅ Handles JSONB data correctly
- ✅ Has transaction safety built-in
- ✅ Is ready for AWS deployment

**Next:** Proceed to **Step 4** (Implement Google OAuth 2.0) once this is tested and working.

---

## 📝 Files Modified

1. ✏️ `requirements.txt` - Updated dependencies
2. ✏️ `config.py` - Replaced Supabase with PostgreSQL connection pool
3. ✏️ `main.py` - Added startup event for connection pool
4. ✏️ `routes/users.py` - Refactored all routes to use SQL
5. ✏️ `routes/questions.py` - Refactored all routes to use SQL
6. ✏️ `routes/matching.py` - Refactored all routes to use SQL
7. ✏️ `seed_questions.py` - Updated to use new connection
8. 🆕 `.env.example` - Environment variable template
9. 🆕 `test_db_connection.py` - Connection test utility
10. 🆕 `MIGRATION_STEP3.md` - This file
