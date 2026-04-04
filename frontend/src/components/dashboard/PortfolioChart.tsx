import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Card } from '../ui/Card'
import { getRiskColor, formatIndustry } from '../../lib/utils'

interface PortfolioChartProps {
  riskDistribution: Record<string, number>
  industryDistribution: Record<string, number>
}

const RISK_ORDER = ['low', 'moderate', 'high', 'very_high']

export function PortfolioChart({ riskDistribution, industryDistribution }: PortfolioChartProps) {
  const riskData = RISK_ORDER
    .filter((key) => riskDistribution[key])
    .map((key) => ({
      name: key === 'very_high' ? 'Very High' : key.charAt(0).toUpperCase() + key.slice(1),
      value: riskDistribution[key],
      color: getRiskColor(key),
    }))

  const industryData = Object.entries(industryDistribution)
    .map(([key, value]) => ({ name: formatIndustry(key), value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {riskData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              formatter={(value: string) => <span className="text-sm text-gray-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Industry Breakdown</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={industryData} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
