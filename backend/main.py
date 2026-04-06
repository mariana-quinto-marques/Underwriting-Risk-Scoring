from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from database import init_db, SessionLocal
from models import Submission
from routers import submissions, portfolio

app = FastAPI(
    title="Underwriting & Risk Scoring Platform",
    description="SME insurance underwriting risk assessment API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(submissions.router)
app.include_router(portfolio.router)


@app.on_event("startup")
def on_startup():
    init_db()
    # Auto-seed if database is empty (needed for Vercel where /tmp is ephemeral)
    db = SessionLocal()
    try:
        if db.query(Submission).count() == 0:
            from seed import seed
            seed()
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
