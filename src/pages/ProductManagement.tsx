import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
import { products } from '../data/mockData'
import { formatCurrency } from '../utils/format'

export function ProductManagement() {
  return (
    <div>
      <PageHeader
        eyebrow="Merchandising"
        title="Product management"
        description="Administrative product table for pricing, category, warranty, review, and tag visibility."
      />
      <DataTable
        headers={['Product', 'Category', 'Price', 'MSRP', 'Rating', 'Warranty', 'Retail tags']}
        rows={products.map((product) => [
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="h-11 w-11 rounded-lg object-cover" />
            <div>
              <p className="font-semibold text-slate-950">{product.name}</p>
              <p className="text-xs text-slate-500">{product.brand}</p>
            </div>
          </div>,
          <Badge tone="info">{product.category}</Badge>,
          formatCurrency(product.price),
          formatCurrency(product.msrp),
          product.rating,
          `${product.warrantyMonths} months`,
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>,
        ])}
      />
    </div>
  )
}
