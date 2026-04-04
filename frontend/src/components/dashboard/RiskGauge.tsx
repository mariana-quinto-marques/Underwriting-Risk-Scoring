import { useEffect, useState } from 'react'
import { Badge } from '../ui/Badge'
import { getRiskColor, getRiskLabel } from '../../lib/utils'
import type { RiskRating } from '../../types'

interface RiskGaugeProps {
  score: number
  rating: RiskRating
}

const ZONES = [
  { label: 'Low', max: 30, color: '#16a34a', bg: '#dcfce7' },
  { label: 'Moderate', max: 55, color: '#d97706', bg: '#fef3c7' },
  { label: 'High', max: 75, color: '#ea580c', bg: '#ffedd5' },
  { label: 'Very High', max: 100, color: '#dc2626', bg: '#fee2e2' },
]

export function RiskGauge({ score, rating }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 50)
    return () => clearTimeout(timer)
  }, [score])

  const color = getRiskColor(rating)

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Large score display */}
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-32 h-32">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(animatedScore / 100) * 327} 327`}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 1s ease-out, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight" style={{ color }}>{score}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">out of 100</span>
        </div>
      </div>

      <Badge variant={rating}>{getRiskLabel(rating)}</Badge>

      {/* Zone bar */}
      <div className="w-full">
        <div className="relative flex h-3 rounded-full overflow-hidden">
          {ZONES.map((zone, i) => {
            const prevMax = i === 0 ? 0 : ZONES[i - 1].max
            const width = zone.max - prevMax
            return (
              <div
                key={zone.label}
                className="h-full"
                style={{
                  width: `${width}%`,
                  backgroundColor: zone.bg,
                }}
              />
            )
          })}
          {/* Score marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
            style={{
              left: `${animatedScore}%`,
              backgroundColor: color,
              transition: 'left 1s ease-out, background-color 0.5s ease',
            }}
          />
        </div>

        {/* Zone labels */}
        <div className="flex mt-2">
          {ZONES.map((zone, i) => {
            const prevMax = i === 0 ? 0 : ZONES[i - 1].max
            const width = zone.max - prevMax
            return (
              <div key={zone.label} style={{ width: `${width}%` }} className="text-center">
                <span className="text-[10px] font-medium" style={{ color: zone.color }}>{zone.label}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-gray-300">0</span>
          <span className="text-[10px] text-gray-300">100</span>
        </div>
      </div>
    </div>
  )
}
