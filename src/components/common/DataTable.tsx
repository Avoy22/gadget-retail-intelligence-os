import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'

type DataTableProps = {
  headers: string[]
  rows: ReactNode[][]
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable({ headers, rows, emptyTitle = 'No records found', emptyDescription = 'Try changing filters or adding a new record.' }: DataTableProps) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50/95 text-xs font-bold uppercase tracking-[0.08em] text-slate-500 backdrop-blur">
            <tr>
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-5 py-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition hover:bg-cyan-50/40">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="whitespace-nowrap px-5 py-4 align-middle text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
