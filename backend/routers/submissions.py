import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Submission
from schemas import (
    SubmissionCreate, SubmissionResponse, RuleExplanation,
    SubmissionListItem, PaginatedSubmissions,
)
from engine import scoring_engine, calculate_premium

router = APIRouter(prefix="/api/submissions", tags=["submissions"])


@router.post("", response_model=SubmissionResponse, status_code=201)
def create_submission(data: SubmissionCreate, db: Session = Depends(get_db)):
    result = scoring_engine.calculate(data)
    premium_min, premium_max = calculate_premium(data.annual_revenue, result.score)

    explanations = [
        {"rule": r.rule_name, "adjustment": r.adjustment, "detail": r.detail}
        for r in result.explanations
    ]

    submission = Submission(
        business_name=data.business_name,
        industry_sector=data.industry_sector,
        num_employees=data.num_employees,
        annual_revenue=data.annual_revenue,
        claims_last_3_years=data.claims_last_3_years,
        location_risk=data.location_risk,
        risk_score=result.score,
        risk_rating=result.rating,
        premium_min=premium_min,
        premium_max=premium_max,
        explanation=json.dumps(explanations),
        status=result.status,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return _to_response(submission)


@router.get("", response_model=PaginatedSubmissions)
def list_submissions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(Submission).count()
    items = (
        db.query(Submission)
        .order_by(Submission.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return PaginatedSubmissions(
        items=[SubmissionListItem.model_validate(s) for s in items],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(submission_id: str, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return _to_response(submission)


def _to_response(submission: Submission) -> SubmissionResponse:
    data = {
        "id": submission.id,
        "created_at": submission.created_at,
        "business_name": submission.business_name,
        "industry_sector": submission.industry_sector,
        "num_employees": submission.num_employees,
        "annual_revenue": submission.annual_revenue,
        "claims_last_3_years": submission.claims_last_3_years,
        "location_risk": submission.location_risk,
        "risk_score": submission.risk_score,
        "risk_rating": submission.risk_rating,
        "premium_min": submission.premium_min,
        "premium_max": submission.premium_max,
        "explanation": json.loads(submission.explanation),
        "status": submission.status,
    }
    return SubmissionResponse(**data)
