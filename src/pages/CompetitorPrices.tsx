import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { getProduct } from '../data/lookups'
import { competitorPrices } from '../data/mockData'
import { formatCurrency } from '../utils/format'

const availabilityTone = (availability: string) => {
  if (availability === 'In stock') return 'success'
  if (availability === 'Limited') return 'warning'
  return 'danger'
}

export function CompetitorPrices() {
  return (
    <div>
      <PageHeader
        eyebrow="Market intelligence"
        title="Competitor prices"
        description="Track mock competitor prices against internal retail pricing to support pricing and promotional decisions."
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
            item.competitor,
            formatCurrency(item.price),
            <span className={delta < 0 ? 'inline-flex items-center gap-1 font-semibold text-rose-700' : 'inline-flex items-center gap-1 font-semibold text-emerald-700'}>
              <Icon size={16} />
              {formatCurrency(Math.abs(delta))}
            </span>,
            <Badge tone={availabilityTone(item.availability)}>{item.availability}</Badge>,
            item.checkedAt,
          ]
        })}
      />
    </div>
  )
}
