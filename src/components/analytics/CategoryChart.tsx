import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { categoryMetrics } from '../../data/mockData'
import type { CategoryMetric } from '../../types'

type CategoryChartProps = {
  data?: CategoryMetric[]
}

export function CategoryChart({ data = categoryMetrics }: CategoryChartProps) {
  return (
    <div className="h-80 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5">
      <h2 className="mb-4 text-lg font-bold text-slate-950">Category revenue</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748b" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#0f172a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
