from uuid import uuid4
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    business_name = Column(String(200), nullable=False)
    industry_sector = Column(String(50), nullable=False)
    num_employees = Column(Integer, nullable=False)
    annual_revenue = Column(Float, nullable=False)
    claims_last_3_years = Column(Integer, nullable=False)
    location_risk = Column(String(20), nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_rating = Column(String(20), nullable=False)
    premium_min = Column(Float, nullable=False)
    premium_max = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    status = Column(String(20), nullable=False)
