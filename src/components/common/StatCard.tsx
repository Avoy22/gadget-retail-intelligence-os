import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string
  trend?: string
  icon: LucideIcon
  tone?: 'dark' | 'cyan' | 'emerald' | 'amber'
}

const toneClasses = {
  dark: 'bg-slate-950 text-white',
  cyan: 'bg-cyan-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-500 text-slate-950',
}

export function StatCard({ label, value, trend, icon: Icon, tone = 'dark' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
      {trend ? <p className="mt-4 text-sm font-bold text-emerald-700">{trend}</p> : null}
    </div>
  )
}
