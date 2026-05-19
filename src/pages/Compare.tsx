import { Check, Minus } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { products } from '../data/mockData'
import { formatCurrency } from '../utils/format'

export function Compare() {
  const comparison = products.slice(0, 4)
  const specRows = ['Display', 'Storage', 'Camera', 'Chip', 'Battery', 'Audio']

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Decision support"
        title="Product comparison"
        description="Compare hero devices side by side for assisted selling, buyer education, and merchandising decisions."
      />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-44 px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Attribute</th>
                {comparison.map((product) => (
                  <th key={product.id} className="px-5 py-4 align-top">
                    <img src={product.image} alt={product.name} className="mb-3 h-28 w-full rounded-lg object-cover" />
                    <p className="text-base font-bold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.brand}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Price</td>
                {comparison.map((product) => (
                  <td key={product.id} className="px-5 py-4 text-lg font-bold text-slate-950">
                    {formatCurrency(product.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Rating</td>
                {comparison.map((product) => (
                  <td key={product.id} className="px-5 py-4 font-semibold text-amber-600">
                    {product.rating} / 5
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Warranty</td>
                {comparison.map((product) => (
                  <td key={product.id} className="px-5 py-4">
                    {product.warrantyMonths} months
                  </td>
                ))}
              </tr>
              {specRows.map((row) => (
                <tr key={row}>
                  <td className="px-5 py-4 font-semibold text-slate-500">{row}</td>
                  {comparison.map((product) => (
                    <td key={product.id} className="px-5 py-4 text-slate-700">
                      {product.specs[row] ?? <Minus size={16} className="text-slate-300" />}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-500">Retail tags</td>
                {comparison.map((product) => (
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
