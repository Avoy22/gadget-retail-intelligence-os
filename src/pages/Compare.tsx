import { useState } from 'react'
import { Check, Minus, X } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { products } from '../data/mockData'
import type { Product } from '../types'
import { formatCurrency } from '../utils/format'

const SPEC_ROWS = ['Display', 'Storage', 'Camera', 'Chip', 'Memory', 'Battery', 'Audio', 'Connectivity']
const MAX_SLOTS = 4
const DEFAULT_SLUGS = ['iphone-16-pro', 'galaxy-s25-ultra', 'pixel-10-pro', 'macbook-pro-14-m4']

const findBySlug = (slug: string): Product | undefined => products.find((product) => product.slug === slug)

export function Compare() {
  const [slugs, setSlugs] = useState<string[]>(DEFAULT_SLUGS)

  const selected = slugs.map(findBySlug).filter((product): product is Product => Boolean(product))

  const updateSlot = (index: number, slug: string) => {
    setSlugs((prev) => {
      const next = [...prev]
      next[index] = slug
      return next
    })
  }

  const removeSlot = (index: number) => {
    if (slugs.length <= 2) return
    setSlugs((prev) => prev.filter((_, i) => i !== index))
  }

  const addSlot = () => {
    if (slugs.length >= MAX_SLOTS) return
    const unused = products.find((product) => !slugs.includes(product.slug))
    if (unused) setSlugs((prev) => [...prev, unused.slug])
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Decision support"
        title="Product comparison"
        description="Compare premium devices side by side for assisted selling, buyer education, and merchandising decisions."
        action={
          slugs.length < MAX_SLOTS ? (
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Add product
            </button>
          ) : null
        }
      />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-44 px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Attribute</th>
                {selected.map((product, index) => (
                  <th key={product.id} className="px-5 py-4 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <img src={product.image} alt={product.name} className="mb-3 h-28 w-full rounded-lg object-cover" />
                      {slugs.length > 2 ? (
                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeSlot(index)}
                          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <X size={16} />
                        </button>
                      ) : null}
                    </div>
                    <select
                      value={product.slug}
                      onChange={(event) => updateSlot(index, event.target.value)}
                      className="mb-2 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-slate-950 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                    >
                      {products.map((candidate) => (
                        <option key={candidate.id} value={candidate.slug} disabled={candidate.slug !== product.slug && slugs.includes(candidate.slug)}>
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-slate-500">{product.brand}</p>
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
                if (!anyHas) return null
                return (
                  <tr key={row}>
                    <td className="px-5 py-4 font-semibold text-slate-500">{row}</td>
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
      </div>
    </section>
  )
}
