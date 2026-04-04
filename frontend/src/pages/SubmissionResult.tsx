import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSubmission } from '../api/client'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { RiskGauge } from '../components/dashboard/RiskGauge'
import { PremiumEstimate } from '../components/dashboard/PremiumEstimate'
import { UnderwritingExplanation } from '../components/dashboard/UnderwritingExplanation'
import { formatCurrency, formatIndustry, getStatusLabel, getRiskColor } from '../lib/utils'
import type { Submission } from '../types'
import { ArrowLeft, Building2, CheckCircle, AlertTriangle, XCircle, ArrowRight, BarChart3, Gauge, PoundSterling, FileWarning } from 'lucide-react'

const statusConfig = {
  approved: {
    icon: CheckCircle,
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    iconColor: 'text-green-600',
    message: 'This submission meets underwriting criteria. Proceed to bind coverage.',
  },
  referred: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-600',
    message: 'This submission requires manual review by a senior underwriter before a decision.',
  },
  declined: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-600',
    message: 'Risk score exceeds threshold. This submission does not meet underwriting criteria.',
  },
}

export function SubmissionResult() {
  const { id } = useParams<{ id: string }>()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getSubmission(id)
      .then(setSubmission)
      .catch(() => setError('Failed to load submission'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl" />
          <div className="h-80 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Submission not found'}</p>
        <Link to="/" className="text-teal hover:underline text-sm mt-2 inline-block">
          Back to form
        </Link>
      </Card>
    )
  }

  const s = submission
  const config = statusConfig[s.status]
  const StatusIcon = config.icon

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-gray-500 hover:text-teal flex items-center gap-1 no-underline">
          <ArrowLeft className="h-4 w-4" /> New Submission
        </Link>
        <Link to="/portfolio" className="text-sm text-gray-500 hover:text-teal flex items-center gap-1 no-underline">
          Portfolio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Decision Banner */}
      <div className={`rounded-xl border p-5 flex items-start gap-4 ${config.bg}`}>
        <StatusIcon className={`h-6 w-6 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{s.business_name}</h1>
            <Badge variant={s.status}>{getStatusLabel(s.status)}</Badge>
          </div>
          <p className={`text-sm ${config.text}`}>{config.message}</p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Gauge className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Risk Score</p>
              <p className="text-xl font-bold" style={{ color: getRiskColor(s.risk_rating) }}>{s.risk_score}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <PoundSterling className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Premium Range</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(s.premium_min)} &ndash; {formatCurrency(s.premium_max)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <FileWarning className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Claims (3yr)</p>
              <p className="text-xl font-bold text-gray-900">{s.claims_last_3_years}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Gauge + Premium */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Risk Assessment</h3>
            <RiskGauge score={s.risk_score} rating={s.risk_rating} />
          </Card>
          <PremiumEstimate min={s.premium_min} max={s.premium_max} rating={s.risk_rating} />
        </div>

        {/* Right column: Explanation */}
        <div className="lg:col-span-3">
          <UnderwritingExplanation
            explanations={s.explanation}
            totalScore={s.risk_score}
            status={s.status}
          />
        </div>
      </div>

      {/* Submission details */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-semibold text-gray-900">Submission Details</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Industry</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatIndustry(s.industry_sector)}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Employees</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{s.num_employees.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Revenue</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatCurrency(s.annual_revenue)}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Claims (3yr)</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{s.claims_last_3_years}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Location Risk</dt>
            <dd className="font-medium text-gray-900 mt-0.5 capitalize">{s.location_risk.replace('_', ' ')}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Submitted</dt>
            <dd className="font-medium text-gray-900 mt-0.5">
              {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </dd>
          </div>
        </div>
      </Card>

      {/* Action Bar */}
      <div className="flex items-center justify-center gap-4 pb-4">
        <Link to="/">
          <Button variant="teal">
            Submit Another <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/portfolio">
          <Button variant="secondary">
            <BarChart3 className="mr-2 h-4 w-4" /> View Portfolio
          </Button>
        </Link>
      </div>
    </div>
  )
}
