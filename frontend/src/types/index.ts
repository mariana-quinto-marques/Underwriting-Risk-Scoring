export type IndustrySector =
  | 'construction'
  | 'retail'
  | 'technology'
  | 'hospitality'
  | 'manufacturing'
  | 'professional_services'
  | 'healthcare'

export type LocationRisk = 'low' | 'medium' | 'high' | 'very_high'
export type RiskRating = 'low' | 'moderate' | 'high' | 'very_high'
export type SubmissionStatus = 'approved' | 'referred' | 'declined'

export interface SubmissionInput {
  business_name: string
  industry_sector: IndustrySector
  num_employees: number
  annual_revenue: number
  claims_last_3_years: number
  location_risk: LocationRisk
}

export interface RuleExplanation {
  rule: string
  adjustment: number
  detail: string
}

export interface Submission {
  id: string
  created_at: string
  business_name: string
  industry_sector: string
  num_employees: number
  annual_revenue: number
  claims_last_3_years: number
  location_risk: string
  risk_score: number
  risk_rating: RiskRating
  premium_min: number
  premium_max: number
  explanation: RuleExplanation[]
  status: SubmissionStatus
}

export interface SubmissionListItem {
  id: string
  created_at: string
  business_name: string
  industry_sector: string
  risk_score: number
  risk_rating: RiskRating
  status: SubmissionStatus
}

export interface PaginatedSubmissions {
  items: SubmissionListItem[]
  total: number
  page: number
  per_page: number
}

export interface PortfolioSummary {
  total_submissions: number
  average_risk_score: number
  risk_distribution: Record<string, number>
  industry_distribution: Record<string, number>
  status_distribution: Record<string, number>
  total_premium_exposure: { min: number; max: number }
}
