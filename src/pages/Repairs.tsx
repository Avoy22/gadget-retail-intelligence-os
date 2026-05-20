import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { Input, Select } from '../components/common/FormControls'
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
        emptyTitle="No repair requests yet"
        emptyDescription="Customer service intake submissions will appear here."
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
          <Select
            value={request.status}
            onChange={(event) => updateRepairStatus(request.id, event.target.value as RepairRequest['status'])}
            className="h-9 font-semibold"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>,
          <Input
            value={request.technicianNotes ?? ''}
            onChange={(event) => updateRepairNotes(request.id, event.target.value)}
            placeholder="Add notes"
            className="h-9 w-64"
          />,
          request.updatedAt,
        ])}
      />
    </div>
  )
}
