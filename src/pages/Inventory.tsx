import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
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

      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_180px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product, brand, store, region" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
        </label>
        <select value={storeId} onChange={(event) => setStoreId(event.target.value)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
          <option value="all">All stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
          <option value="all">All statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Low">Low stock</option>
          <option value="Out">Out of stock</option>
        </select>
      </div>

      <DataTable
        headers={['Product', 'Store', 'Region', 'Stock', 'Reserved', 'Available', 'Reorder point', 'Status', 'Updated']}
        rows={filtered.map((item) => {
          const product = getProduct(item.productId)
          const store = getStore(item.storeId)
          const stockStatus = getStockStatus(item)
          return [
            <span className="font-semibold text-slate-950">{product?.name}</span>,
            store?.name,
            store?.region,
            <input
              type="number"
              min="0"
              value={item.stock}
              onChange={(event) => updateInventoryQuantity(item.id, Number(event.target.value))}
              className="h-9 w-24 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
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
