import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Edit3, Plus, Search } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { DataTable } from '../components/common/DataTable'
import { PageHeader } from '../components/common/PageHeader'
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      status: form.status,
      description: form.description.trim(),
      price: Number(form.price),
      msrp: Number(form.msrp),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      warrantyMonths: Number(form.warrantyMonths),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

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

      <form onSubmit={submit} className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">{editingId ? 'Edit product' : 'Add product'}</h2>
            <p className="text-sm text-slate-500">Changes save to this browser immediately.</p>
          </div>
          {editingId ? (
            <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          ) : null}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <input value={form.name} onChange={(event) => setField('name', event.target.value)} required placeholder="Product name" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          <input value={form.brand} onChange={(event) => setField('brand', event.target.value)} required placeholder="Brand" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          <select value={form.category} onChange={(event) => setField('category', event.target.value as ProductCategory)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select value={form.status} onChange={(event) => setField('status', event.target.value as ProductStatus)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <input value={form.price} onChange={(event) => setField('price', event.target.value)} required type="number" min="0" placeholder="Price" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          <input value={form.msrp} onChange={(event) => setField('msrp', event.target.value)} required type="number" min="0" placeholder="MSRP" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          <input value={form.warrantyMonths} onChange={(event) => setField('warrantyMonths', event.target.value)} required type="number" min="0" placeholder="Warranty months" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          <input value={form.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="Tags, comma separated" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          <input value={form.image} onChange={(event) => setField('image', event.target.value)} placeholder="Image URL" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 md:col-span-2" />
          <input value={form.description} onChange={(event) => setField('description', event.target.value)} required placeholder="Description" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 md:col-span-2" />
        </div>
        <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800">
          {editingId ? <Edit3 size={17} /> : <Plus size={17} />}
          {editingId ? 'Save changes' : 'Add product'}
        </button>
      </form>

      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value as ProductStatus | 'all')} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="discontinued">Discontinued</option>
        </select>
      </div>

      <DataTable
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
            <button type="button" onClick={() => editProduct(product)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Edit
            </button>
            <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">
              Discontinue
            </button>
          </div>,
        ])}
      />
    </div>
  )
}
