import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Edit3, Plus } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card, CardHeader } from '../components/common/Card'
import { DataTable } from '../components/common/DataTable'
import { Input, Select, Textarea } from '../components/common/FormControls'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { useAppData } from '../context/AppDataContext'
import { categories } from '../data/mockData'
import type { Product, ProductCategory, ProductStatus } from '../types'
import { formatCurrency } from '../utils/format'

type ProductFormState = {
  name: string
  brand: string
  category: ProductCategory
  status: ProductStatus
  description: string
  price: string
  msrp: string
  image: string
  warrantyMonths: string
  tags: string
}

const blankForm: ProductFormState = {
  name: '',
  brand: '',
  category: 'Smartphones',
  status: 'active',
  description: '',
  price: '',
  msrp: '',
  image: '',
  warrantyMonths: '12',
  tags: '',
}

const statusTone = (status: ProductStatus) => {
  if (status === 'active') return 'success'
  if (status === 'draft') return 'warning'
  return 'danger'
}

const toForm = (product: Product): ProductFormState => ({
  name: product.name,
  brand: product.brand,
  category: product.category,
  status: product.status,
  description: product.description,
  price: String(product.price),
  msrp: String(product.msrp),
  image: product.image,
  warrantyMonths: String(product.warrantyMonths),
  tags: product.tags.join(', '),
})

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ProductStatus | 'all'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductFormState>(blankForm)

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = status === 'all' || product.status === status
        return matchesQuery && matchesStatus
      }),
    [products, query, status],
  )

  const setField = <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const editProduct = (product: Product) => {
    setEditingId(product.id)
    setForm(toForm(product))
  }

  const reset = () => {
    setEditingId(null)
    setForm(blankForm)
  }

  const toPositiveNumber = (value: string) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      status: form.status,
      description: form.description.trim(),
      price: toPositiveNumber(form.price),
      msrp: toPositiveNumber(form.msrp),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      warrantyMonths: toPositiveNumber(form.warrantyMonths),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    if (!payload.name || !payload.brand || !payload.description) return
    if (editingId) updateProduct(editingId, payload)
    else addProduct(payload)
    reset()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Merchandising"
        title="Product management"
        description="Create, edit, publish, draft, and discontinue products with localStorage persistence."
      />

      <form onSubmit={submit} className="mb-6">
        <Card>
          <CardHeader
            title={editingId ? 'Edit product' : 'Add product'}
            description="Changes save to this browser immediately through the existing localStorage workflow."
            action={editingId ? <Button onClick={reset} variant="secondary">Cancel</Button> : null}
          />
          <div className="grid gap-4 p-5 md:grid-cols-4">
            <Input label="Product name" value={form.name} onChange={(event) => setField('name', event.target.value)} required placeholder="Product name" />
            <Input label="Brand" value={form.brand} onChange={(event) => setField('brand', event.target.value)} required placeholder="Brand" />
            <Select label="Category" value={form.category} onChange={(event) => setField('category', event.target.value as ProductCategory)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Select label="Status" value={form.status} onChange={(event) => setField('status', event.target.value as ProductStatus)}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="discontinued">Discontinued</option>
            </Select>
            <Input label="Price" value={form.price} onChange={(event) => setField('price', event.target.value)} required type="number" min="0" placeholder="Price" />
            <Input label="MSRP" value={form.msrp} onChange={(event) => setField('msrp', event.target.value)} required type="number" min="0" placeholder="MSRP" />
            <Input label="Warranty" value={form.warrantyMonths} onChange={(event) => setField('warrantyMonths', event.target.value)} required type="number" min="0" placeholder="Months" />
            <Input label="Tags" value={form.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="Comma separated" />
            <Input label="Image URL" value={form.image} onChange={(event) => setField('image', event.target.value)} placeholder="Image URL" fieldClassName="md:col-span-2" />
            <Textarea label="Description" value={form.description} onChange={(event) => setField('description', event.target.value)} required placeholder="Describe the retail value proposition" fieldClassName="md:col-span-2" />
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <Button type="submit" icon={editingId ? <Edit3 size={17} /> : <Plus size={17} />}>
              {editingId ? 'Save changes' : 'Add product'}
            </Button>
          </div>
        </Card>
      </form>

      <Card className="mb-4 grid gap-3 p-4 md:grid-cols-[1fr_220px]">
        <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories" />
        <Select value={status} onChange={(event) => setStatus(event.target.value as ProductStatus | 'all')}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="discontinued">Discontinued</option>
        </Select>
      </Card>

      <DataTable
        emptyTitle="No products match"
        emptyDescription="Adjust the search or status filter to find products."
        headers={['Product', 'Status', 'Category', 'Price', 'MSRP', 'Warranty', 'Retail tags', 'Actions']}
        rows={filtered.map((product) => [
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="h-11 w-11 rounded-lg object-cover" />
            <div>
              <p className="font-semibold text-slate-950">{product.name}</p>
              <p className="text-xs text-slate-500">{product.brand}</p>
            </div>
          </div>,
          <Badge tone={statusTone(product.status)}>{product.status}</Badge>,
          <Badge tone="info">{product.category}</Badge>,
          formatCurrency(product.price),
          formatCurrency(product.msrp),
          `${product.warrantyMonths} months`,
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>,
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => editProduct(product)} icon={<Edit3 size={14} />}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={() => deleteProduct(product.id)}>
              Discontinue
            </Button>
          </div>,
        ])}
      />
    </div>
  )
}
