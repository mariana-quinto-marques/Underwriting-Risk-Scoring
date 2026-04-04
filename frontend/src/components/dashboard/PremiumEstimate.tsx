import { Card } from '../ui/Card'
import { formatCurrency, getRiskColor } from '../../lib/utils'
import type { RiskRating } from '../../types'

interface PremiumEstimateProps {
  min: number
  max: number
  rating: RiskRating
}

const borderColors: Record<string, string> = {
  low: 'border-l-green-500',
  moderate: 'border-l-amber-500',
  high: 'border-l-orange-500',
  very_high: 'border-l-red-500',
}

export function PremiumEstimate({ min, max, rating }: PremiumEstimateProps) {
  return (
    <Card borderColor={borderColors[rating]}>
      <p className="text-sm font-medium text-gray-500 mb-1">Estimated Annual Premium</p>
      <p className="text-2xl font-bold text-gray-900">
        {formatCurrency(min)} &mdash; {formatCurrency(max)}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Based on 0.3% of annual revenue adjusted by risk score
      </p>
    </Card>
  )
}
