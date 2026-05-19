import { AlertTriangle, Boxes, CalendarCheck, CircleDollarSign, Wrench } from 'lucide-react'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { RevenueChart } from '../components/analytics/RevenueChart'
import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { StatCard } from '../components/common/StatCard'
import { getProduct, getStore } from '../data/lookups'
import { inventory, repairRequests, reservations } from '../data/mockData'
import { formatCurrency, getStockStatus } from '../utils/format'

export function AdminDashboard() {
  const lowStock = inventory.filter((item) => getStockStatus(item).tone !== 'success').slice(0, 6)
  const activeRepairs = repairRequests.filter((request) => request.status !== 'Closed').length

  return (
    <div>
      <PageHeader
        eyebrow="Admin dashboard"
        title="Retail operations overview"
        description="A board-level view of revenue, inventory risk, reservations, and active warranty service work."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="May revenue" value={formatCurrency(1330000)} trend="+14.6% MoM" icon={CircleDollarSign} />
        <StatCard label="Network units" value="1,284" trend="65 inventory signals" icon={Boxes} />
        <StatCard label="Reservations" value={String(reservations.length)} trend="3 ready for pickup" icon={CalendarCheck} />
        <StatCard label="Active repairs" value={String(activeRepairs)} trend="2 high priority" icon={Wrench} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <RevenueChart />
        <CategoryChart />
      </div>
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-600" size={20} />
          <h2 className="text-xl font-bold text-slate-950">Inventory exceptions</h2>
        </div>
        <DataTable
          headers={['Product', 'Store', 'Available', 'Reserved', 'Status', 'Updated']}
          rows={lowStock.map((item) => {
            const product = getProduct(item.productId)
            const store = getStore(item.storeId)
            const status = getStockStatus(item)
            return [
              <span className="font-semibold text-slate-950">{product?.name}</span>,
              store?.name,
              Math.max(0, item.stock - item.reserved),
              item.reserved,
              <Badge tone={status.tone}>{status.label}</Badge>,
              item.updatedAt,
            ]
          })}
        />
      </div>
    </div>
  )
}
