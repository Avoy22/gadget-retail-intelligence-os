import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { getProduct, getStore } from '../data/lookups'
import { repairRequests } from '../data/mockData'

const priorityTone = (priority: string) => {
  if (priority === 'High') return 'danger'
  if (priority === 'Medium') return 'warning'
  return 'success'
}

export function Repairs() {
  return (
    <div>
      <PageHeader
        eyebrow="Service desk"
        title="Repairs"
        description="Warranty and service queue with customer issue details, priority, status, and store ownership."
      />
      <DataTable
        headers={['Request', 'Customer', 'Product', 'Store', 'Issue', 'Priority', 'Status', 'Created']}
        rows={repairRequests.map((request) => [
          <span className="font-semibold text-slate-950">{request.id}</span>,
          request.customer,
          getProduct(request.productId)?.name,
          getStore(request.storeId)?.name,
          <span className="inline-block max-w-xs truncate">{request.issue}</span>,
          <Badge tone={priorityTone(request.priority)}>{request.priority}</Badge>,
          <Badge tone="info">{request.status}</Badge>,
          request.createdAt,
        ])}
      />
    </div>
  )
}
