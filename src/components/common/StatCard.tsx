import { TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../../utils/format'

type StatCardProps = {
  label: string
  value: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  tone?: 'dark' | 'cyan' | 'emerald' | 'amber'
}

const toneClasses = {
  dark: 'bg-slate-950 text-white',
  cyan: 'bg-cyan-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-500 text-slate-950',
}

const trendClasses = {
  up: 'text-emerald-700',
  down: 'text-rose-700',
  neutral: 'text-slate-500',
}

export function StatCard({ label, value, trend, trendDirection = 'up', icon: Icon, tone = 'dark' }: StatCardProps) {
  const TrendIcon = trendDirection === 'down' ? TrendingDown : TrendingUp
  const showTrendIcon = trendDirection !== 'neutral'

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/10">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm', toneClasses[tone])}>
          <Icon size={20} />
        </div>
      </div>
      {trend ? (
        <p className={cx('mt-4 inline-flex items-center gap-1.5 text-sm font-bold', trendClasses[trendDirection])}>
          {showTrendIcon ? <TrendIcon size={15} /> : null}
          {trend}
        </p>
      ) : null}
    </div>
  )
}
