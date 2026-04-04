from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

IndustrySector = Literal[
    "construction", "retail", "technology", "hospitality",
    "manufacturing", "professional_services", "healthcare"
]
LocationRisk = Literal["low", "medium", "high", "very_high"]
RiskRating = Literal["low", "moderate", "high", "very_high"]
Status = Literal["approved", "referred", "declined"]


class SubmissionCreate(BaseModel):
    business_name: str = Field(min_length=1, max_length=200)
    industry_sector: IndustrySector
    num_employees: int = Field(ge=1)
    annual_revenue: float = Field(ge=0)
    claims_last_3_years: int = Field(ge=0)
    location_risk: LocationRisk


class RuleExplanation(BaseModel):
    rule: str
    adjustment: float
    detail: str


class SubmissionResponse(BaseModel):
    id: str
    created_at: datetime
    business_name: str
    industry_sector: str
    num_employees: int
    annual_revenue: float
    claims_last_3_years: int
    location_risk: str
    risk_score: float
    risk_rating: str
    premium_min: float
    premium_max: float
    explanation: list[RuleExplanation]
    status: str

    model_config = {"from_attributes": True}


class SubmissionListItem(BaseModel):
    id: str
    created_at: datetime
    business_name: str
    industry_sector: str
    risk_score: float
    risk_rating: str
    status: str

    model_config = {"from_attributes": True}


class PaginatedSubmissions(BaseModel):
    items: list[SubmissionListItem]
    total: int
    page: int
    per_page: int


class PortfolioSummary(BaseModel):
    total_submissions: int
    average_risk_score: float
    risk_distribution: dict[str, int]
    industry_distribution: dict[str, int]
    status_distribution: dict[str, int]
    total_premium_exposure: dict[str, float]
