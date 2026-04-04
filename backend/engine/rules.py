from dataclasses import dataclass


@dataclass
class RuleResult:
    rule_name: str
    adjustment: float
    detail: str


INDUSTRY_RISK = {
    "construction": (20, "High-risk manual labour industry"),
    "manufacturing": (15, "Industrial operations carry elevated risk"),
    "hospitality": (10, "Public-facing with liability exposure"),
    "healthcare": (8, "Regulated sector with malpractice exposure"),
    "retail": (5, "Standard commercial risk profile"),
    "professional_services": (2, "Low physical risk, some E&O exposure"),
    "technology": (0, "Low physical risk profile"),
}


def rule_base_score(data) -> RuleResult:
    return RuleResult("Base Score", 50, "Starting base score for all submissions")


def rule_industry(data) -> RuleResult:
    adjustment, detail = INDUSTRY_RISK.get(data.industry_sector, (5, "Unknown industry"))
    return RuleResult(f"Industry: {data.industry_sector.replace('_', ' ').title()}", adjustment, detail)


def rule_claims_history(data) -> RuleResult:
    claims = data.claims_last_3_years
    if claims == 0:
        return RuleResult("Claims History", -10, "Clean claims record — favourable risk indicator")
    elif claims == 1:
        return RuleResult("Claims History", 0, "Single claim — neutral impact")
    elif claims == 2:
        return RuleResult("Claims History", 10, "Multiple claims suggest emerging risk pattern")
    elif claims <= 4:
        return RuleResult("Claims History", 15, "Frequent claims indicate higher loss probability")
    else:
        return RuleResult("Claims History", 25, "Excessive claims history — significant risk concern")


def rule_revenue(data) -> RuleResult:
    revenue = data.annual_revenue
    if revenue > 5_000_000:
        return RuleResult("Revenue Factor", -10, "Large established business — lower relative risk")
    elif revenue > 1_000_000:
        return RuleResult("Revenue Factor", -5, "Mid-market business with stable operations")
    elif revenue > 500_000:
        return RuleResult("Revenue Factor", 0, "Standard revenue bracket — neutral impact")
    else:
        return RuleResult("Revenue Factor", 5, "Smaller business — higher volatility risk")


def rule_employees(data) -> RuleResult:
    count = data.num_employees
    if count <= 10:
        return RuleResult("Employee Count", -5, "Micro business — limited exposure")
    elif count <= 50:
        return RuleResult("Employee Count", 0, "Small business — standard workforce risk")
    elif count <= 200:
        return RuleResult("Employee Count", 5, "Medium workforce — moderate employer liability")
    else:
        return RuleResult("Employee Count", 10, "Large workforce — significant employer liability exposure")


LOCATION_RISK = {
    "low": (-5, "Low-risk geographic area"),
    "medium": (0, "Standard geographic risk profile"),
    "high": (10, "Elevated geographic risk — flood/crime factors"),
    "very_high": (20, "High-risk area — significant environmental or security concerns"),
}


def rule_location(data) -> RuleResult:
    adjustment, detail = LOCATION_RISK.get(data.location_risk, (0, "Unknown location risk"))
    return RuleResult("Location Risk", adjustment, detail)


DEFAULT_RULES = [
    rule_base_score,
    rule_industry,
    rule_claims_history,
    rule_revenue,
    rule_employees,
    rule_location,
]
