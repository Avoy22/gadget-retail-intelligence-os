import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cx } from '../../utils/format'

const controlClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100'

type FieldShellProps = {
  label?: string
  helper?: string
  error?: string
  children: ReactNode
  className?: string
}

function FieldShell({ label, helper, error, children, className }: FieldShellProps) {
  return (
    <label className={cx('grid gap-2 text-sm font-semibold text-slate-700', className)}>
      {label ? <span>{label}</span> : null}
      {children}
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
      {!error && helper ? <span className="text-xs font-medium text-slate-500">{helper}</span> : null}
    </label>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helper?: string
  error?: string
  fieldClassName?: string
}

export function Input({ label, helper, error, fieldClassName, className, ...props }: InputProps) {
  const input = <input className={cx(controlClass, 'h-11', className)} {...props} />
  if (!label && !helper && !error) return input
  return (
    <FieldShell label={label} helper={helper} error={error} className={fieldClassName}>
      {input}
    </FieldShell>
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  helper?: string
  error?: string
  fieldClassName?: string
  children: ReactNode
}

export function Select({ label, helper, error, fieldClassName, children, className, ...props }: SelectProps) {
  const select = (
    <select className={cx(controlClass, 'h-11 appearance-auto', className)} {...props}>
      {children}
    </select>
  )
  if (!label && !helper && !error) return select
  return (
    <FieldShell label={label} helper={helper} error={error} className={fieldClassName}>
      {select}
    </FieldShell>
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  helper?: string
  error?: string
  fieldClassName?: string
}

export function Textarea({ label, helper, error, fieldClassName, className, ...props }: TextareaProps) {
  const textarea = <textarea className={cx(controlClass, 'min-h-32 py-3', className)} {...props} />
  if (!label && !helper && !error) return textarea
  return (
    <FieldShell label={label} helper={helper} error={error} className={fieldClassName}>
      {textarea}
    </FieldShell>
  )
}
