import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { useAppData } from '../context/AppDataContext'
import type { RepairRequest } from '../types'

const priorityTone = (priority: string) => {
  if (priority === 'High') return 'danger'
  if (priority === 'Medium') return 'warning'
  return 'success'
}

const statuses: RepairRequest['status'][] = ['New', 'Diagnosing', 'Waiting parts', 'Ready', 'Closed']

export function Repairs() {
  const { repairRequests, getProduct, getStore, updateRepairStatus, updateRepairNotes } = useAppData()

  return (
    <div>
      <PageHeader
        eyebrow="Service desk"
        title="Repairs"
        description="Submitted warranty requests with editable status and technician notes persisted locally."
      />
      <DataTable
        headers={['Request', 'Customer', 'Product', 'Store', 'Issue', 'Priority', 'Status', 'Technician notes', 'Updated']}
        rows={repairRequests.map((request) => [
          <span className="font-semibold text-slate-950">{request.id}</span>,
          <div>
            <p className="font-semibold text-slate-950">{request.customer}</p>
            <p className="text-xs text-slate-500">{request.email}</p>
          </div>,
          getProduct(request.productId)?.name,
          getStore(request.storeId)?.name,
          <span className="inline-block max-w-xs truncate">{request.issue}</span>,
          <Badge tone={priorityTone(request.priority)}>{request.priority}</Badge>,
          <select
            value={request.status}
            onChange={(event) => updateRepairStatus(request.id, event.target.value as RepairRequest['status'])}
            className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>,
          <input
            value={request.technicianNotes ?? ''}
            onChange={(event) => updateRepairNotes(request.id, event.target.value)}
            placeholder="Add notes"
            className="h-9 w-64 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />,
          request.updatedAt,
        ])}
      />
    </div>
  )
}
