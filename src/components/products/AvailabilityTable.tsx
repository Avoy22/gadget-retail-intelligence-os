import { useAppData } from '../../context/AppDataContext'
import type { InventoryItem } from '../../types'
import { getStockStatus } from '../../utils/format'
import { Badge } from '../common/Badge'
import { DataTable } from '../common/DataTable'

type AvailabilityTableProps = {
  items: InventoryItem[]
}

export function AvailabilityTable({ items }: AvailabilityTableProps) {
  const { getStore } = useAppData()

  return (
    <DataTable
      emptyTitle="No store availability"
      emptyDescription="This product does not have inventory signals yet."
      headers={['Store', 'Region', 'Available', 'Reserved', 'Status', 'Updated']}
      rows={items.map((item) => {
        const store = getStore(item.storeId)
        const status = getStockStatus(item)
        return [
          <span className="font-semibold text-slate-950">{store?.name}</span>,
          store?.region,
          Math.max(0, item.stock - item.reserved),
          item.reserved,
          <Badge tone={status.tone}>{status.label}</Badge>,
          item.updatedAt,
        ]
      })}
    />
  )
}
