from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.users import router as users_router
from routes.auth import router as auth_router
from routes.questions import router as questions_router
from routes.matching import router as matching_router
from config import init_db_pool

app = FastAPI(title="Cupid's Ledger API", version="1.0.0")

# Initialize database connection pool on startup
@app.on_event("startup")
async def startup_event():
    init_db_pool()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch all unhandled exceptions so CORS headers are still applied."""
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


app.include_router(users_router)
app.include_router(questions_router)
app.include_router(matching_router)
app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "Cupid's Ledger API is running"}
