import { useMemo, useState } from 'react'
import { Check, Plus, Minus, X } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { Select } from '../components/common/FormControls'
import { PageHeader } from '../components/common/PageHeader'
import { useAppData } from '../context/AppDataContext'
import type { Product } from '../types'
import { formatCurrency } from '../utils/format'

const SPEC_ROWS = ['Display', 'Storage', 'Camera', 'Chip', 'Memory', 'Battery', 'Audio', 'Connectivity']
const MAX_SLOTS = 4
const DEFAULT_SLUGS = ['iphone-16-pro', 'galaxy-s25-ultra', 'pixel-10-pro', 'macbook-pro-14-m4']

export function Compare() {
  const { activeProducts } = useAppData()
  const [slugs, setSlugs] = useState<string[]>(DEFAULT_SLUGS)

  const comparisonSlugs = useMemo(() => {
    const valid = slugs.filter((slug) => activeProducts.some((product) => product.slug === slug))
    if (valid.length >= 2) return valid
    const filler = activeProducts
      .filter((product) => !valid.includes(product.slug))
      .slice(0, Math.max(0, 2 - valid.length))
      .map((product) => product.slug)
    return [...valid, ...filler]
  }, [activeProducts, slugs])

  const selected = comparisonSlugs
    .map((slug) => activeProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product))

  const updateSlot = (index: number, slug: string) => {
    const next = [...comparisonSlugs]
    next[index] = slug
    setSlugs(next)
  }

  const removeSlot = (index: number) => {
    if (comparisonSlugs.length <= 2) return
    setSlugs(comparisonSlugs.filter((_, i) => i !== index))
  }

  const addSlot = () => {
    if (comparisonSlugs.length >= MAX_SLOTS) return
    const unused = activeProducts.find((product) => !comparisonSlugs.includes(product.slug))
    if (unused) setSlugs([...comparisonSlugs, unused.slug])
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Decision support"
        title="Product comparison"
        description="Compare premium devices side by side for assisted selling, buyer education, and merchandising decisions."
        action={
          comparisonSlugs.length < MAX_SLOTS ? (
            <Button onClick={addSlot} variant="secondary" icon={<Plus size={16} />}>
              Add product
            </Button>
          ) : null
        }
      />
      {!selected.length ? (
        <EmptyState title="No products to compare" description="Add active products to the catalog, then return to compare SKUs side by side." />
      ) : null}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="w-44 px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Attribute</th>
                {selected.map((product, index) => (
                  <th key={product.id} className="px-5 py-4 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <img src={product.image} alt={product.name} className="mb-3 h-28 w-full rounded-2xl object-cover shadow-sm" />
                      {comparisonSlugs.length > 2 ? (
                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeSlot(index)}
                          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <X size={16} />
                        </button>
                      ) : null}
                    </div>
                    <Select
                      value={product.slug}
                      onChange={(event) => updateSlot(index, event.target.value)}
                      className="mb-2"
                    >
                      {activeProducts.map((candidate) => (
                        <option key={candidate.id} value={candidate.slug} disabled={candidate.slug !== product.slug && comparisonSlugs.includes(candidate.slug)}>
                          {candidate.name}
                        </option>
                      ))}
                    </Select>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-500">{product.brand}</p>
                      <Badge tone="info">{product.category}</Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Price</td>
                {selected.map((product) => (
                  <td key={product.id} className="px-5 py-4 text-lg font-bold text-slate-950">
                    {formatCurrency(product.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Rating</td>
                {selected.map((product) => (
                  <td key={product.id} className="px-5 py-4 font-semibold text-amber-600">
                    {product.rating} / 5
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Warranty</td>
                {selected.map((product) => (
                  <td key={product.id} className="px-5 py-4">
                    {product.warrantyMonths} months
                  </td>
                ))}
              </tr>
              {SPEC_ROWS.map((row) => {
                const anyHas = selected.some((product) => product.specs[row])
                const values = selected.map((product) => product.specs[row] ?? '')
                const differs = new Set(values).size > 1
                if (!anyHas) return null
                return (
                  <tr key={row} className={differs ? 'bg-amber-50/40' : undefined}>
                    <td className="px-5 py-4 font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        {row}
                        {differs ? <Badge tone="warning">differs</Badge> : null}
                      </span>
                    </td>
                    {selected.map((product) => (
                      <td key={product.id} className="px-5 py-4 text-slate-700">
                        {product.specs[row] ?? <Minus size={16} className="text-slate-300" />}
                      </td>
                    ))}
                  </tr>
                )
              })}
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Retail tags</td>
                {selected.map((product) => (
                  <td key={product.id} className="px-5 py-4">
                    <div className="grid gap-2">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Check size={15} className="text-emerald-600" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}
