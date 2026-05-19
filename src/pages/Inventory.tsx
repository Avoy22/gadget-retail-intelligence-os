import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { getProduct, getStore } from '../data/lookups'
import { inventory } from '../data/mockData'
import { getStockStatus } from '../utils/format'

export function Inventory() {
  return (
    <div>
      <PageHeader
        eyebrow="Stock control"
        title="Inventory"
        description="Store-level stock and reservation status for fulfillment, replenishment, and in-store sales teams."
      />
      <DataTable
        headers={['Product', 'Store', 'Region', 'Stock', 'Reserved', 'Available', 'Reorder point', 'Status', 'Updated']}
        rows={inventory.map((item) => {
          const product = getProduct(item.productId)
          const store = getStore(item.storeId)
          const status = getStockStatus(item)
          return [
            <span className="font-semibold text-slate-950">{product?.name}</span>,
            store?.name,
            store?.region,
            item.stock,
            item.reserved,
            Math.max(0, item.stock - item.reserved),
            item.reorderPoint,
            <Badge tone={status.tone}>{status.label}</Badge>,
            item.updatedAt,
          ]
        })}
      />
    </div>
  )
}
