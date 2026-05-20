import { Link } from 'react-router-dom'
import { ArrowUpRight, Star, Warehouse } from 'lucide-react'
import type { Product } from '../../types'
import { useAppData } from '../../context/AppDataContext'
import { formatCurrency } from '../../utils/format'
import { Badge } from '../common/Badge'

type ProductCardProps = {
  product: Product
}

const statusTone = (status: Product['status']) => {
  if (status === 'active') return 'success'
  if (status === 'draft') return 'warning'
  return 'danger'
}

export function ProductCard({ product }: ProductCardProps) {
  const { getTotalAvailable } = useAppData()
  const available = getTotalAvailable(product.id)
  const discount = product.msrp > product.price ? Math.round(((product.msrp - product.price) / product.msrp) * 100) : 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-950/10">
      <Link to={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className={`relative h-56 overflow-hidden bg-linear-to-br ${product.accent}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 mix-blend-luminosity transition duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge tone="info">{product.category}</Badge>
          </div>
          <div className="absolute right-4 top-4">
            <Badge tone={statusTone(product.status)} className="capitalize">
              {product.status}
            </Badge>
          </div>
          {discount > 0 ? (
            <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-lg backdrop-blur">
              Save {discount}%
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.brand}</p>
              <h2 className="mt-1 truncate text-lg font-bold text-slate-950">{product.name}</h2>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
              <Star size={14} fill="currentColor" />
              {product.rating}
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between pt-5">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
                {discount > 0 ? (
                  <p className="text-xs text-slate-400 line-through">{formatCurrency(product.msrp)}</p>
                ) : null}
              </div>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Warehouse size={13} className="text-cyan-700" />
                {available} in network
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-cyan-700 group-hover:shadow-lg group-hover:shadow-cyan-900/30">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
