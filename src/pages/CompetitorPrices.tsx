import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { useAppData } from '../context/AppDataContext'
import type { CompetitorPrice } from '../types'
import { formatCurrency } from '../utils/format'

const availabilityTone = (availability: string) => {
  if (availability === 'In stock') return 'success'
  if (availability === 'Limited') return 'warning'
  return 'danger'
}

const availabilityOptions: CompetitorPrice['availability'][] = ['In stock', 'Limited', 'Out of stock']

export function CompetitorPrices() {
  const { competitorPrices, getProduct, updateCompetitorPrice } = useAppData()

  return (
    <div>
      <PageHeader
        eyebrow="Market intelligence"
        title="Competitor prices"
        description="Track and update competitor price records against internal retail pricing."
      />
      <DataTable
        headers={['Product', 'Our price', 'Competitor', 'Competitor price', 'Delta', 'Availability', 'Checked']}
        rows={competitorPrices.map((item) => {
          const product = getProduct(item.productId)
          const delta = item.price - (product?.price ?? 0)
          const Icon = delta < 0 ? ArrowDownRight : delta > 0 ? ArrowUpRight : Minus
          return [
            <span className="font-semibold text-slate-950">{product?.name}</span>,
            formatCurrency(product?.price ?? 0),
            <input
              value={item.competitor}
              onChange={(event) => updateCompetitorPrice(item.id, { competitor: event.target.value })}
              className="h-9 w-36 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            />,
            <input
              type="number"
              min="0"
              value={item.price}
              onChange={(event) => updateCompetitorPrice(item.id, { price: Number(event.target.value) })}
              className="h-9 w-28 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            />,
            <span className={delta < 0 ? 'inline-flex items-center gap-1 font-semibold text-rose-700' : 'inline-flex items-center gap-1 font-semibold text-emerald-700'}>
              <Icon size={16} />
              {formatCurrency(Math.abs(delta))}
            </span>,
            <div className="flex items-center gap-2">
              <Badge tone={availabilityTone(item.availability)}>{item.availability}</Badge>
              <select
                value={item.availability}
                onChange={(event) => updateCompetitorPrice(item.id, { availability: event.target.value as CompetitorPrice['availability'] })}
                className="h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              >
                {availabilityOptions.map((availability) => (
                  <option key={availability} value={availability}>
                    {availability}
                  </option>
                ))}
              </select>
            </div>,
            item.checkedAt,
          ]
        })}
      />
    </div>
  )
}
