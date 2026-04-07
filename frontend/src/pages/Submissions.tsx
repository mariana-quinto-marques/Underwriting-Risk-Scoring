import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listSubmissions } from '../api/client'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatIndustry, getStatusLabel, getRiskColor } from '../lib/utils'
import type { PaginatedSubmissions } from '../types'
import { ClipboardList, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export function Submissions() {
  const [data, setData] = useState<PaginatedSubmissions | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    listSubmissions(page, 12)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-teal" />
          <h1 className="text-2xl font-bold text-gray-900">Submission History</h1>
        </div>
        <Link to="/">
          <Button variant="teal" className="text-sm">
            <Plus className="mr-1.5 h-4 w-4" /> New Submission
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <Card className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No submissions yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first underwriting submission to get started.</p>
          <Link to="/" className="inline-block mt-4">
            <Button variant="teal">Create Submission</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="!p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Business</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Industry</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Risk Score</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="py-3 px-4">
                      <Link to={`/result/${item.id}`} className="font-medium text-gray-900 hover:text-teal no-underline">
                        {item.business_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{formatIndustry(item.industry_sector)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getRiskColor(item.risk_rating) }}
                        />
                        <span className="font-semibold" style={{ color: getRiskColor(item.risk_rating) }}>
                          {item.risk_score}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={item.status}>{getStatusLabel(item.status)}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Pagination */}
          {data.total > 12 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {(page - 1) * 12 + 1}&ndash;{Math.min(page * 12, data.total)} of {data.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="!px-3 !py-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  disabled={page * 12 >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                  className="!px-3 !py-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
