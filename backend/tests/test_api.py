import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from database import Base, get_db
import models  # noqa: F401 — ensure model is registered with Base
from main import app

# Create test database in memory with StaticPool so all connections share the same DB
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


class TestSubmissionsAPI:
    def test_create_submission(self, client):
        response = client.post("/api/submissions", json={
            "business_name": "Test Corp",
            "industry_sector": "technology",
            "num_employees": 25,
            "annual_revenue": 2000000,
            "claims_last_3_years": 1,
            "location_risk": "low",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["business_name"] == "Test Corp"
        assert 0 <= data["risk_score"] <= 100
        assert data["risk_rating"] in ["low", "moderate", "high", "very_high"]
        assert data["status"] in ["approved", "referred", "declined"]
        assert len(data["explanation"]) > 0

    def test_invalid_industry_returns_422(self, client):
        response = client.post("/api/submissions", json={
            "business_name": "Bad Corp",
            "industry_sector": "invalid",
            "num_employees": 10,
            "annual_revenue": 100000,
            "claims_last_3_years": 0,
            "location_risk": "low",
        })
        assert response.status_code == 422

    def test_list_submissions(self, client):
        client.post("/api/submissions", json={
            "business_name": "List Test",
            "industry_sector": "retail",
            "num_employees": 5,
            "annual_revenue": 500000,
            "claims_last_3_years": 0,
            "location_risk": "medium",
        })
        response = client.get("/api/submissions")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1
        assert len(data["items"]) >= 1

    def test_get_submission_by_id(self, client):
        create = client.post("/api/submissions", json={
            "business_name": "Fetch Test",
            "industry_sector": "healthcare",
            "num_employees": 20,
            "annual_revenue": 1000000,
            "claims_last_3_years": 2,
            "location_risk": "high",
        })
        sub_id = create.json()["id"]
        response = client.get(f"/api/submissions/{sub_id}")
        assert response.status_code == 200
        assert response.json()["id"] == sub_id

    def test_get_nonexistent_returns_404(self, client):
        response = client.get("/api/submissions/nonexistent-id")
        assert response.status_code == 404


class TestPortfolioAPI:
    def test_empty_portfolio(self, client):
        response = client.get("/api/portfolio/summary")
        assert response.status_code == 200
        data = response.json()
        assert data["total_submissions"] == 0

    def test_portfolio_with_data(self, client):
        client.post("/api/submissions", json={
            "business_name": "Portfolio Test",
            "industry_sector": "construction",
            "num_employees": 50,
            "annual_revenue": 3000000,
            "claims_last_3_years": 3,
            "location_risk": "high",
        })
        response = client.get("/api/portfolio/summary")
        assert response.status_code == 200
        data = response.json()
        assert data["total_submissions"] == 1
        assert data["average_risk_score"] > 0


class TestHealthCheck:
    def test_health(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
