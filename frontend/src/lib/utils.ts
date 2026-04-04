import type { RiskRating, SubmissionStatus } from '../types'

export function formatCurrency(amount: number): string {
  const hasDecimals = amount % 1 !== 0
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getRiskColor(rating: RiskRating | string): string {
  switch (rating) {
    case 'low': return '#16a34a'
    case 'moderate': return '#d97706'
    case 'high': return '#ea580c'
    case 'very_high': return '#dc2626'
    default: return '#6b7280'
  }
}

export function getRiskLabel(rating: RiskRating | string): string {
  switch (rating) {
    case 'low': return 'Low Risk'
    case 'moderate': return 'Moderate Risk'
    case 'high': return 'High Risk'
    case 'very_high': return 'Very High Risk'
    default: return rating
  }
}

export function getStatusLabel(status: SubmissionStatus | string): string {
  switch (status) {
    case 'approved': return 'Approved'
    case 'referred': return 'Referred'
    case 'declined': return 'Declined'
    default: return status
  }
}

export function formatIndustry(sector: string): string {
  return sector.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
