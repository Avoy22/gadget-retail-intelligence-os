import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { Input, Select } from '../components/common/FormControls'
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
        emptyTitle="No competitor prices"
        emptyDescription="Add competitor records in mock data to track price gaps."
        headers={['Product', 'Our price', 'Competitor', 'Competitor price', 'Delta', 'Availability', 'Checked']}
        rows={competitorPrices.map((item) => {
          const product = getProduct(item.productId)
          const delta = item.price - (product?.price ?? 0)
          const Icon = delta < 0 ? ArrowDownRight : delta > 0 ? ArrowUpRight : Minus
          const deltaTone = delta < 0 ? 'text-rose-700' : delta > 0 ? 'text-emerald-700' : 'text-slate-500'
          return [
            <span className="font-semibold text-slate-950">{product?.name}</span>,
            formatCurrency(product?.price ?? 0),
            <Input
              value={item.competitor}
              onChange={(event) => updateCompetitorPrice(item.id, { competitor: event.target.value })}
              className="h-9 w-36"
            />,
            <Input
              type="number"
              min="0"
              value={item.price}
              onChange={(event) => updateCompetitorPrice(item.id, { price: Number(event.target.value) })}
              className="h-9 w-28"
            />,
            <span className={`inline-flex items-center gap-1 font-bold ${deltaTone}`}>
              <Icon size={16} />
              {delta === 0 ? 'Match' : formatCurrency(Math.abs(delta))}
            </span>,
            <div className="flex items-center gap-2">
              <Badge tone={availabilityTone(item.availability)}>{item.availability}</Badge>
              <Select
                value={item.availability}
                onChange={(event) => updateCompetitorPrice(item.id, { availability: event.target.value as CompetitorPrice['availability'] })}
                className="h-9 w-36"
                aria-label="Update availability"
              >
                {availabilityOptions.map((availability) => (
                  <option key={availability} value={availability}>
                    {availability}
                  </option>
                ))}
              </Select>
            </div>,
            item.checkedAt,
          ]
        })}
      />
    </div>
  )
}
