import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string
  trend?: string
  icon: LucideIcon
}

export function StatCard({ label, value, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
          <Icon size={20} />
        </div>
      </div>
      {trend ? <p className="mt-4 text-sm font-semibold text-emerald-700">{trend}</p> : null}
    </div>
  )
}
