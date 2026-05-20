import { AlertTriangle, Boxes, CalendarCheck, CircleDollarSign, Clock3, Wrench } from 'lucide-react'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { RevenueChart } from '../components/analytics/RevenueChart'
import { Badge } from '../components/common/Badge'
import type { BadgeTone } from '../components/common/Badge'
import { Card, CardHeader } from '../components/common/Card'
import { DataTable } from '../components/common/DataTable'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { useAppData } from '../context/AppDataContext'
import { formatCurrency, formatNumber, getStockStatus } from '../utils/format'

export function AdminDashboard() {
  const {
    categoryMetrics,
    derivedSalesMetrics,
    getProduct,
    getStore,
    inventory,
    repairRequests,
    reservations,
  } = useAppData()
  const lowStock = inventory.filter((item) => getStockStatus(item).tone !== 'success').slice(0, 6)
  const activeRepairs = repairRequests.filter((request) => request.status !== 'Closed').length
  const highPriorityRepairs = repairRequests.filter((request) => request.priority === 'High' && request.status !== 'Closed').length
  const readyReservations = reservations.filter((reservation) => reservation.status === 'Ready').length
  const pendingReservations = reservations.filter((reservation) => reservation.status === 'Pending pickup').length
  const totalUnits = inventory.reduce((sum, item) => sum + Math.max(0, item.stock - item.reserved), 0)
  const latest = derivedSalesMetrics[derivedSalesMetrics.length - 1]
  const previous = derivedSalesMetrics[derivedSalesMetrics.length - 2]
  const revenueDelta =
    previous && previous.revenue > 0
      ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
      : 0
  const statusSummary: Array<[string, number, string, BadgeTone]> = [
    ['Ready pickup', readyReservations, 'Reservations staged for customers', 'success'],
    ['Pending pickup', pendingReservations, 'Follow-up before expiry', 'warning'],
    ['Active repairs', activeRepairs, 'Open diagnostics and service work', 'info'],
    ['High priority', highPriorityRepairs, 'Urgent repair cases', 'danger'],
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Admin dashboard"
        title="Retail operations overview"
        description="A board-level view of revenue, inventory risk, reservations, and active warranty service work."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label={`${latest.month} revenue`} value={formatCurrency(latest.revenue)} trend={`+${revenueDelta.toFixed(1)}% MoM`} icon={CircleDollarSign} tone="cyan" />
        <StatCard label="Network units" value={formatNumber(totalUnits)} trend={`${inventory.length} inventory signals`} icon={Boxes} tone="dark" />
        <StatCard label="Reservations" value={String(reservations.length)} trend={`${readyReservations} ready for pickup`} icon={CalendarCheck} tone="emerald" />
        <StatCard label="Active repairs" value={String(activeRepairs)} trend={`${highPriorityRepairs} high priority`} icon={Wrench} tone="amber" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <RevenueChart data={derivedSalesMetrics} />
        <CategoryChart data={categoryMetrics} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Repair and reservation status" description="Operational queues that need action today." />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {statusSummary.map(([label, value, copy, tone]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Badge tone={tone}>{label}</Badge>
                <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent activity" description="Latest local workflow records." />
          <div className="grid gap-3 p-5">
            {[...reservations.slice(0, 2), ...repairRequests.slice(0, 2)].map((item) => {
              const isRepair = 'issue' in item
              return (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <Clock3 size={18} />
                  </span>
                  <div>
                    <p className="font-bold text-slate-950">{isRepair ? 'Repair request' : 'Reservation'} {item.id}</p>
                    <p className="text-sm text-slate-500">{item.customer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      <div className="mt-6">
        <SectionHeader
          title="Inventory exceptions"
          description="Low and out-of-stock signals sorted into a compact action list."
          action={<AlertTriangle className="text-amber-600" size={22} />}
        />
        {lowStock.length ? (
          <DataTable
            emptyTitle="No exceptions"
            emptyDescription="Every store is at or above its reorder point."
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
        ) : (
          <EmptyState
            title="No exceptions"
            description="Every store is at or above its reorder point. Adjust stock from the Inventory tab to test alerts."
          />
        )}
      </div>
    </div>
  )
}
