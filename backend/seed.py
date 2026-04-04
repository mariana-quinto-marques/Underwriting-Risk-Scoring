"""Seed the database with realistic demo submissions."""
import sys
import os
import json
import random
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, init_db
from models import Submission
from schemas import SubmissionCreate
from engine import scoring_engine, calculate_premium

BUSINESSES = [
    ("Acme Builders Ltd", "construction"),
    ("Thames Construction Group", "construction"),
    ("Redwood Building Co", "construction"),
    ("Marshall & Sons Contractors", "construction"),
    ("Peak Roofing Solutions", "construction"),
    ("FreshMart Groceries", "retail"),
    ("Urban Threads Fashion", "retail"),
    ("HomeStyle Interiors", "retail"),
    ("Green Garden Supplies", "retail"),
    ("The Book Corner", "retail"),
    ("Bright Electronics Retail", "retail"),
    ("CloudNine Software", "technology"),
    ("DataStream Analytics", "technology"),
    ("Vertex Digital Solutions", "technology"),
    ("ByteForge Systems", "technology"),
    ("NexGen AI Labs", "technology"),
    ("Grand Hotel Group", "hospitality"),
    ("The Riverside Inn", "hospitality"),
    ("Coastal Retreats Ltd", "hospitality"),
    ("Metro Bar & Kitchen", "hospitality"),
    ("Precision Manufacturing Co", "manufacturing"),
    ("Sterling Metals Ltd", "manufacturing"),
    ("Oakwood Furniture Makers", "manufacturing"),
    ("Pacific Plastics Group", "manufacturing"),
    ("Clarke & Partners LLP", "professional_services"),
    ("Whitfield Consulting", "professional_services"),
    ("Apex Accountancy", "professional_services"),
    ("Sterling Legal Services", "professional_services"),
    ("Nova Financial Advisors", "professional_services"),
    ("Greenfield Medical Centre", "healthcare"),
    ("CareFirst Clinic", "healthcare"),
    ("MindWell Therapy Practice", "healthcare"),
    ("HealthBridge Diagnostics", "healthcare"),
    ("Summit Dental Practice", "healthcare"),
    ("Harbour Engineering Ltd", "manufacturing"),
    ("CityScape Architects", "professional_services"),
    ("QuickByte IT Support", "technology"),
    ("The Artisan Bakery", "retail"),
    ("Northstar Logistics", "manufacturing"),
    ("Evergreen Care Home", "healthcare"),
    ("Skyline Scaffolding", "construction"),
    ("BluePeak Adventures", "hospitality"),
    ("Diamond Clean Services", "professional_services"),
    ("TechVault Security", "technology"),
    ("Meadowview Farm Shop", "retail"),
]

LOCATION_WEIGHTS = {"low": 0.3, "medium": 0.35, "high": 0.25, "very_high": 0.1}


def generate_submission(name: str, industry: str, days_ago: int) -> dict:
    employees = random.choice([3, 5, 8, 12, 25, 40, 75, 120, 250, 500])
    revenue = random.choice([
        150_000, 300_000, 500_000, 750_000,
        1_200_000, 2_500_000, 3_800_000, 5_500_000, 8_000_000,
    ])
    claims = random.choices([0, 0, 0, 1, 1, 2, 2, 3, 4, 5], k=1)[0]
    location = random.choices(
        list(LOCATION_WEIGHTS.keys()),
        weights=list(LOCATION_WEIGHTS.values()),
        k=1,
    )[0]

    data = SubmissionCreate(
        business_name=name,
        industry_sector=industry,
        num_employees=employees,
        annual_revenue=revenue,
        claims_last_3_years=claims,
        location_risk=location,
    )

    result = scoring_engine.calculate(data)
    premium_min, premium_max = calculate_premium(data.annual_revenue, result.score)

    explanations = [
        {"rule": r.rule_name, "adjustment": r.adjustment, "detail": r.detail}
        for r in result.explanations
    ]

    created = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=random.randint(0, 23))

    return {
        "business_name": name,
        "industry_sector": industry,
        "num_employees": employees,
        "annual_revenue": revenue,
        "claims_last_3_years": claims,
        "location_risk": location,
        "risk_score": result.score,
        "risk_rating": result.rating,
        "premium_min": premium_min,
        "premium_max": premium_max,
        "explanation": json.dumps(explanations),
        "status": result.status,
        "created_at": created,
    }


def seed():
    init_db()
    db = SessionLocal()

    existing = db.query(Submission).count()
    if existing > 0:
        print(f"Database already has {existing} submissions. Skipping seed.")
        db.close()
        return

    print(f"Seeding {len(BUSINESSES)} submissions...")
    for i, (name, industry) in enumerate(BUSINESSES):
        data = generate_submission(name, industry, days_ago=random.randint(1, 90))
        submission = Submission(**data)
        db.add(submission)

    db.commit()
    db.close()
    print(f"Done! Seeded {len(BUSINESSES)} submissions.")


if __name__ == "__main__":
    seed()
