import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cx } from '../../utils/format'

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        className={cx(
          'h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100',
          className,
        )}
        {...props}
      />
    </label>
  )
}
