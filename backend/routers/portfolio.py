from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Submission
from schemas import PortfolioSummary

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


@router.get("/summary", response_model=PortfolioSummary)
def get_portfolio_summary(db: Session = Depends(get_db)):
    total = db.query(Submission).count()

    if total == 0:
        return PortfolioSummary(
            total_submissions=0,
            average_risk_score=0,
            risk_distribution={},
            industry_distribution={},
            status_distribution={},
            total_premium_exposure={"min": 0, "max": 0},
        )

    avg_score = db.query(func.avg(Submission.risk_score)).scalar() or 0

    risk_dist = dict(
        db.query(Submission.risk_rating, func.count())
        .group_by(Submission.risk_rating)
        .all()
    )
    industry_dist = dict(
        db.query(Submission.industry_sector, func.count())
        .group_by(Submission.industry_sector)
        .all()
    )
    status_dist = dict(
        db.query(Submission.status, func.count())
        .group_by(Submission.status)
        .all()
    )

    premium_min_total = db.query(func.sum(Submission.premium_min)).scalar() or 0
    premium_max_total = db.query(func.sum(Submission.premium_max)).scalar() or 0

    return PortfolioSummary(
        total_submissions=total,
        average_risk_score=round(avg_score, 1),
        risk_distribution=risk_dist,
        industry_distribution=industry_dist,
        status_distribution=status_dist,
        total_premium_exposure={
            "min": round(premium_min_total, 2),
            "max": round(premium_max_total, 2),
        },
    )
