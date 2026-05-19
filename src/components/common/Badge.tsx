import { cx } from '../../utils/format'

type BadgeProps = {
  children: React.ReactNode
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const tones = {
  default: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-cyan-200 bg-cyan-50 text-cyan-700',
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  )
}
