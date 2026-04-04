import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPortfolioSummary, listSubmissions } from '../api/client'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PortfolioChart } from '../components/dashboard/PortfolioChart'
import { formatCurrency, getRiskColor, getStatusLabel, formatIndustry } from '../lib/utils'
import type { PortfolioSummary, SubmissionListItem } from '../types'
import { BarChart3, Gauge, FileStack, PoundSterling, TrendingUp, Plus, ArrowRight } from 'lucide-react'

export function Portfolio() {
  const [data, setData] = useState<PortfolioSummary | null>(null)
  const [recent, setRecent] = useState<SubmissionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getPortfolioSummary(),
      listSubmissions(1, 8),
    ])
      .then(([summary, subs]) => {
        setData(summary)
        setRecent(subs.items)
      })
      .catch(() => setError('Failed to load portfolio data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-gray-200 rounded-xl" />
          <div className="h-72 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">{error || 'No data available'}</p>
        <p className="text-sm text-gray-400 mt-1">Submit some applications to populate the portfolio dashboard.</p>
        <Link to="/" className="inline-block mt-4">
          <Button variant="teal">Create First Submission</Button>
        </Link>
      </Card>
    )
  }

  const avgRating =
    data.average_risk_score <= 30 ? 'low'
    : data.average_risk_score <= 55 ? 'moderate'
    : data.average_risk_score <= 75 ? 'high'
    : 'very_high'

  const approvalRate = data.total_submissions > 0
    ? Math.round(((data.status_distribution['approved'] || 0) / data.total_submissions) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-teal" />
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
        </div>
        <Link to="/">
          <Button variant="teal" className="text-sm">
            <Plus className="mr-1.5 h-4 w-4" /> New Submission
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileStack className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{data.total_submissions}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Gauge className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Risk Score</p>
              <p className="text-2xl font-bold" style={{ color: getRiskColor(avgRating) }}>
                {data.average_risk_score}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Approval Rate</p>
              <p className="text-2xl font-bold text-green-600">{approvalRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <PoundSterling className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Premium Exposure</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(data.total_premium_exposure.min)}</p>
              <p className="text-xs text-gray-400">to {formatCurrency(data.total_premium_exposure.max)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="!p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Decision Breakdown</p>
          <div className="flex gap-3">
            {Object.entries(data.status_distribution).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <Badge variant={status}>{getStatusLabel(status)}</Badge>
                <span className="text-sm font-semibold text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Charts */}
      <PortfolioChart
        riskDistribution={data.risk_distribution}
        industryDistribution={data.industry_distribution}
      />

      {/* Recent Submissions */}
      {recent.length > 0 && (
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Submissions</h3>
            <Link to="/history" className="text-xs text-teal hover:underline flex items-center gap-1 no-underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {recent.map((item, i) => (
                <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="py-2.5 px-5">
                    <Link to={`/result/${item.id}`} className="font-medium text-gray-900 hover:text-teal no-underline">
                      {item.business_name}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-gray-400 text-xs">{formatIndustry(item.industry_sector)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-semibold text-xs" style={{ color: getRiskColor(item.risk_rating) }}>
                      {item.risk_score}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge variant={item.status}>{getStatusLabel(item.status)}</Badge>
                  </td>
                  <td className="py-2.5 px-5 text-right text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
