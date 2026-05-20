import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, PackageCheck, TrendingUp, Users } from 'lucide-react'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { RevenueChart } from '../components/analytics/RevenueChart'
import { PageHeader } from '../components/common/PageHeader'
import { StatCard } from '../components/common/StatCard'
import { categoryMetrics, salesMetrics } from '../data/mockData'
import { formatCurrency, formatNumber } from '../utils/format'

export function Analytics() {
  const trailingRevenue = salesMetrics.reduce((sum, entry) => sum + entry.revenue, 0)
  const trailingUnits = salesMetrics.reduce((sum, entry) => sum + entry.units, 0)
  const avgMargin = salesMetrics.reduce((sum, entry) => sum + entry.margin, 0) / salesMetrics.length

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Analytics"
        title="Retail performance intelligence"
        description="Recharts-powered visuals for revenue, units, margin, and category growth using local mock data."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Trailing revenue" value={formatCurrency(trailingRevenue)} trend="+18.2% YoY" icon={TrendingUp} />
        <StatCard label="Units sold" value={formatNumber(trailingUnits)} trend="+11.7% YoY" icon={PackageCheck} />
        <StatCard label="Avg margin" value={`${avgMargin.toFixed(1)}%`} trend="+2.1 pts" icon={Activity} />
        <StatCard label="Members served" value="38.4k" trend="+9.8% YoY" icon={Users} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <RevenueChart />
        <CategoryChart />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-80 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Units and margin</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={salesMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="units" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Growth leaders</h2>
          <div className="mt-4 grid gap-3">
            {[...categoryMetrics]
              .sort((a, b) => b.growth - a.growth)
              .slice(0, 5)
              .map((item) => (
                <div key={item.category} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="font-semibold text-slate-700">{item.category}</span>
                  <span className="font-bold text-emerald-700">+{item.growth}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
