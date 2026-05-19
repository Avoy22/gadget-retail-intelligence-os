import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { getProduct, getStore } from '../data/lookups'
import { reservations } from '../data/mockData'

const toneForStatus = (status: string) => {
  if (status === 'Ready') return 'success'
  if (status === 'Expired' || status === 'Cancelled') return 'danger'
  return 'warning'
}

export function Reservations() {
  return (
    <div>
      <PageHeader
        eyebrow="Pickup workflow"
        title="Reservations"
        description="Customer product reservations with pickup status, store location, and date signals."
      />
      <DataTable
        headers={['Reservation', 'Customer', 'Product', 'Store', 'Date', 'Status']}
        rows={reservations.map((reservation) => [
          <span className="font-semibold text-slate-950">{reservation.id}</span>,
          reservation.customer,
          getProduct(reservation.productId)?.name,
          getStore(reservation.storeId)?.name,
          reservation.date,
          <Badge tone={toneForStatus(reservation.status)}>{reservation.status}</Badge>,
        ])}
      />
    </div>
  )
}
