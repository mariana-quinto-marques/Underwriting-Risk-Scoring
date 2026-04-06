import os

# Use /tmp for SQLite on Vercel (serverless has read-only filesystem except /tmp)
_default_db = "sqlite:////tmp/underwriting.db" if os.getenv("VERCEL") else "sqlite:///./underwriting.db"
DATABASE_URL = os.getenv("DATABASE_URL", _default_db)

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5180",
    "http://localhost:3000",
    "*",  # Allow Vercel preview domains
]
