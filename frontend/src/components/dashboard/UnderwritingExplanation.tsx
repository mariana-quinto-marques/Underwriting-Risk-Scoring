import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { getStatusLabel } from '../../lib/utils'
import type { RuleExplanation, SubmissionStatus } from '../../types'

interface Props {
  explanations: RuleExplanation[]
  totalScore: number
  status: SubmissionStatus
}

export function UnderwritingExplanation({ explanations, totalScore, status }: Props) {
  let cumulative = 0

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Underwriting Breakdown</h3>
      <p className="text-xs text-gray-400 mb-4">How each risk factor contributes to the final score</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Rule</th>
              <th className="text-right py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide w-20">Points</th>
              <th className="text-left py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide pl-4 hidden md:table-cell">Impact</th>
              <th className="text-left py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide pl-4">Detail</th>
            </tr>
          </thead>
          <tbody>
            {explanations.map((rule, i) => {
              cumulative += rule.adjustment
              const barWidth = Math.min(Math.abs(rule.adjustment) / 50 * 100, 100)
              const isPositive = rule.adjustment > 0
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
                  <td className="py-3 font-medium text-gray-700">{rule.rule}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded text-xs font-bold ${
                        isPositive
                          ? 'bg-red-50 text-red-700'
                          : rule.adjustment < 0
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {rule.adjustment > 0 ? '+' : ''}{rule.adjustment}
                    </span>
                  </td>
                  <td className="py-3 pl-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 w-24">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isPositive ? 'bg-red-400' : rule.adjustment < 0 ? 'bg-green-400' : 'bg-gray-300'}`}
                          style={{ width: `${barWidth}%`, transition: 'width 0.5s ease' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500 pl-4 text-xs">{rule.detail}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200">
              <td className="py-4 font-bold text-gray-900">Total Score</td>
              <td className="py-4 text-right">
                <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded text-xs font-bold bg-gray-900 text-white">
                  {totalScore}
                </span>
              </td>
              <td className="py-4 pl-4 hidden md:table-cell" />
              <td className="py-4 pl-4">
                <Badge variant={status}>{getStatusLabel(status)}</Badge>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
