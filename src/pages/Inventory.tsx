import { useMemo, useState } from 'react'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { DataTable } from '../components/common/DataTable'
import { Input, Select } from '../components/common/FormControls'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { useAppData } from '../context/AppDataContext'
import { getStockStatus } from '../utils/format'

export function Inventory() {
  const { inventory, stores, getProduct, getStore, updateInventoryQuantity } = useAppData()
  const [query, setQuery] = useState('')
  const [storeId, setStoreId] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      inventory.filter((item) => {
        const product = getProduct(item.productId)
        const store = getStore(item.storeId)
        const stockStatus = getStockStatus(item).label
        const matchesQuery = `${product?.name} ${product?.brand} ${store?.name} ${store?.region}`.toLowerCase().includes(query.toLowerCase())
        const matchesStore = storeId === 'all' || item.storeId === storeId
        const matchesStatus = status === 'all' || stockStatus === status
        return matchesQuery && matchesStore && matchesStatus
      }),
    [getProduct, getStore, inventory, query, status, storeId],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Stock control"
        title="Inventory"
        description="Store-level stock editing with low-stock and out-of-stock detection saved to localStorage."
      />

      <Card className="mb-4 grid gap-3 p-4 lg:grid-cols-[1fr_220px_180px]">
        <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product, brand, store, region" />
        <Select value={storeId} onChange={(event) => setStoreId(event.target.value)}>
          <option value="all">All stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Low">Low stock</option>
          <option value="Out">Out of stock</option>
        </Select>
      </Card>

      <DataTable
        emptyTitle="No inventory signals"
        emptyDescription="Adjust the search, store, or status filters to find inventory rows."
        headers={['Product', 'Store', 'Region', 'Stock', 'Reserved', 'Available', 'Reorder point', 'Status', 'Updated']}
        rows={filtered.map((item) => {
          const product = getProduct(item.productId)
          const store = getStore(item.storeId)
          const stockStatus = getStockStatus(item)
          return [
            <span className="font-semibold text-slate-950">{product?.name}</span>,
            store?.name,
            store?.region,
            <Input
              type="number"
              min="0"
              value={item.stock}
              onChange={(event) => updateInventoryQuantity(item.id, Number(event.target.value))}
              className="h-9 w-24 font-semibold"
            />,
            item.reserved,
            Math.max(0, item.stock - item.reserved),
            item.reorderPoint,
            <Badge tone={stockStatus.tone}>{stockStatus.label}</Badge>,
            item.updatedAt,
          ]
        })}
      />
    </div>
  )
}
