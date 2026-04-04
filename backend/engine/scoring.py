from dataclasses import dataclass, field
from .rules import RuleResult, DEFAULT_RULES


@dataclass
class ScoringResult:
    score: float
    rating: str
    status: str
    explanations: list[RuleResult] = field(default_factory=list)


class RiskScoringEngine:
    def __init__(self, rules=None):
        self.rules = rules or DEFAULT_RULES

    def calculate(self, data) -> ScoringResult:
        explanations = [rule(data) for rule in self.rules]
        raw_score = sum(r.adjustment for r in explanations)
        score = max(0, min(100, raw_score))

        if score <= 30:
            rating = "low"
        elif score <= 55:
            rating = "moderate"
        elif score <= 75:
            rating = "high"
        else:
            rating = "very_high"

        if score <= 40:
            status = "approved"
        elif score <= 70:
            status = "referred"
        else:
            status = "declined"

        return ScoringResult(
            score=round(score, 1),
            rating=rating,
            status=status,
            explanations=explanations,
        )


scoring_engine = RiskScoringEngine()
