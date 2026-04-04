def calculate_premium(annual_revenue: float, risk_score: float) -> tuple[float, float]:
    base_premium = annual_revenue * 0.003
    risk_multiplier = 0.5 + (risk_score / 100)
    premium_mid = base_premium * risk_multiplier

    premium_min = max(500, premium_mid * 0.85)
    premium_max = max(750, premium_mid * 1.15)

    if premium_max - premium_min < 250:
        premium_max = premium_min + 250

    return round(premium_min, 2), round(premium_max, 2)
