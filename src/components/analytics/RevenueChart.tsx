import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { salesMetrics } from '../../data/mockData'
import type { SalesMetric } from '../../types'

type RevenueChartProps = {
  data?: SalesMetric[]
}

export function RevenueChart({ data = salesMetrics }: RevenueChartProps) {
  return (
    <div className="h-80 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5">
      <h2 className="mb-4 text-lg font-bold text-slate-950">Revenue trend</h2>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0891b2" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#0891b2" strokeWidth={3} fill="url(#revenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
