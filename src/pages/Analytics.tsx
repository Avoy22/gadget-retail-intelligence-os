import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, PackageCheck, TrendingUp, Users } from 'lucide-react'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { RevenueChart } from '../components/analytics/RevenueChart'
import { PageHeader } from '../components/common/PageHeader'
import { StatCard } from '../components/common/StatCard'
import { useAppData } from '../context/AppDataContext'
import { formatCurrency, formatNumber } from '../utils/format'

export function Analytics() {
  const { categoryMetrics, derivedSalesMetrics } = useAppData()
  const trailingRevenue = derivedSalesMetrics.reduce((sum, entry) => sum + entry.revenue, 0)
  const trailingUnits = derivedSalesMetrics.reduce((sum, entry) => sum + entry.units, 0)
  const avgMargin = derivedSalesMetrics.reduce((sum, entry) => sum + entry.margin, 0) / derivedSalesMetrics.length

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Analytics"
        title="Retail performance intelligence"
        description="Recharts-powered visuals for revenue, units, margin, and category growth using local mock data."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Trailing revenue" value={formatCurrency(trailingRevenue)} trend="+18.2% YoY" trendDirection="up" icon={TrendingUp} tone="cyan" />
        <StatCard label="Units sold" value={formatNumber(trailingUnits)} trend="+11.7% YoY" trendDirection="up" icon={PackageCheck} tone="emerald" />
        <StatCard label="Avg margin" value={`${avgMargin.toFixed(1)}%`} trend="+2.1 pts" trendDirection="up" icon={Activity} tone="amber" />
        <StatCard label="Members served" value="38.4k" trend="+9.8% YoY" trendDirection="up" icon={Users} tone="dark" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <RevenueChart data={derivedSalesMetrics} />
        <CategoryChart data={categoryMetrics} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-80 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Units and margin</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={derivedSalesMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="units" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5">
          <h2 className="text-lg font-bold text-slate-950">Growth leaders</h2>
          <div className="mt-4 grid gap-3">
            {[...categoryMetrics]
              .sort((a, b) => b.growth - a.growth)
              .slice(0, 5)
              .map((item) => (
                <div key={item.category} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
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
