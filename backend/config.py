import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./underwriting.db")
CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000"]
