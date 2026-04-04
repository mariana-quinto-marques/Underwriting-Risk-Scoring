import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from schemas import SubmissionCreate
from engine.scoring import RiskScoringEngine
from engine.rules import rule_industry, rule_claims_history, rule_revenue, rule_employees, rule_location
from engine.premium import calculate_premium


def _make_data(**overrides):
    defaults = {
        "business_name": "Test Co",
        "industry_sector": "technology",
        "num_employees": 10,
        "annual_revenue": 1_000_000,
        "claims_last_3_years": 0,
        "location_risk": "low",
    }
    defaults.update(overrides)
    return SubmissionCreate(**defaults)


class TestIndividualRules:
    def test_construction_adds_20(self):
        result = rule_industry(_make_data(industry_sector="construction"))
        assert result.adjustment == 20

    def test_technology_adds_0(self):
        result = rule_industry(_make_data(industry_sector="technology"))
        assert result.adjustment == 0

    def test_zero_claims_subtracts_10(self):
        result = rule_claims_history(_make_data(claims_last_3_years=0))
        assert result.adjustment == -10

    def test_five_plus_claims_adds_25(self):
        result = rule_claims_history(_make_data(claims_last_3_years=6))
        assert result.adjustment == 25

    def test_high_revenue_subtracts_10(self):
        result = rule_revenue(_make_data(annual_revenue=6_000_000))
        assert result.adjustment == -10

    def test_small_business_subtracts_5(self):
        result = rule_employees(_make_data(num_employees=5))
        assert result.adjustment == -5

    def test_low_location_subtracts_5(self):
        result = rule_location(_make_data(location_risk="low"))
        assert result.adjustment == -5

    def test_very_high_location_adds_20(self):
        result = rule_location(_make_data(location_risk="very_high"))
        assert result.adjustment == 20


class TestScoringEngine:
    def test_low_risk_tech_company(self):
        data = _make_data(
            industry_sector="technology",
            num_employees=5,
            annual_revenue=6_000_000,
            claims_last_3_years=0,
            location_risk="low",
        )
        engine = RiskScoringEngine()
        result = engine.calculate(data)
        # 50 + 0 - 10 - 10 - 5 - 5 = 20
        assert result.score == 20
        assert result.rating == "low"
        assert result.status == "approved"

    def test_high_risk_construction(self):
        data = _make_data(
            industry_sector="construction",
            num_employees=250,
            annual_revenue=300_000,
            claims_last_3_years=4,
            location_risk="very_high",
        )
        engine = RiskScoringEngine()
        result = engine.calculate(data)
        # 50 + 20 + 15 + 5 + 10 + 20 = 120 -> clamped to 100
        assert result.score == 100
        assert result.rating == "very_high"
        assert result.status == "declined"

    def test_score_clamped_to_0_100(self):
        engine = RiskScoringEngine()
        # Best case: 50 + 0 - 10 - 10 - 5 - 5 = 20 (can't go below 0 without more negative rules)
        data = _make_data()
        result = engine.calculate(data)
        assert 0 <= result.score <= 100

    def test_moderate_risk(self):
        data = _make_data(
            industry_sector="retail",
            num_employees=30,
            annual_revenue=800_000,
            claims_last_3_years=2,
            location_risk="medium",
        )
        engine = RiskScoringEngine()
        result = engine.calculate(data)
        # 50 + 5 + 10 + 0 + 0 + 0 = 65
        assert result.score == 65
        assert result.rating == "high"
        assert result.status == "referred"


class TestPremiumCalculator:
    def test_basic_premium(self):
        min_p, max_p = calculate_premium(1_000_000, 50)
        assert min_p > 0
        assert max_p > min_p

    def test_floor_premium(self):
        min_p, max_p = calculate_premium(10_000, 10)
        assert min_p >= 500
        assert max_p >= 750

    def test_higher_risk_means_higher_premium(self):
        _, max_low = calculate_premium(1_000_000, 20)
        _, max_high = calculate_premium(1_000_000, 80)
        assert max_high > max_low
