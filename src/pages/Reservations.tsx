import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { Select } from '../components/common/FormControls'
import { PageHeader } from '../components/common/PageHeader'
import { useAppData } from '../context/AppDataContext'
import type { Reservation } from '../types'

const toneForStatus = (status: string) => {
  if (status === 'Ready') return 'success'
  if (status === 'Expired' || status === 'Cancelled') return 'danger'
  return 'warning'
}

const statuses: Reservation['status'][] = ['Ready', 'Pending pickup', 'Expired', 'Cancelled']

export function Reservations() {
  const { reservations, getProduct, getStore, updateReservationStatus } = useAppData()

  return (
    <div>
      <PageHeader
        eyebrow="Pickup workflow"
        title="Reservations"
        description="Customer product reservations with editable pickup status, store location, and date signals."
      />
      <DataTable
        emptyTitle="No reservations yet"
        emptyDescription="Customer reservations created from product detail pages will appear here."
        headers={['Reservation', 'Customer', 'Product', 'Store', 'Date', 'Status', 'Update']}
        rows={reservations.map((reservation) => [
          <span className="font-semibold text-slate-950">{reservation.id}</span>,
          <div>
            <p className="font-semibold text-slate-950">{reservation.customer}</p>
            {reservation.email ? <p className="text-xs text-slate-500">{reservation.email}</p> : null}
          </div>,
          getProduct(reservation.productId)?.name,
          getStore(reservation.storeId)?.name,
          reservation.date,
          <Badge tone={toneForStatus(reservation.status)}>{reservation.status}</Badge>,
          <Select
            value={reservation.status}
            onChange={(event) => updateReservationStatus(reservation.id, event.target.value as Reservation['status'])}
            className="h-9 font-semibold"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>,
        ])}
      />
    </div>
  )
}
