import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import type { Product } from '../../types'
import { useAppData } from '../../context/AppDataContext'
import { formatCurrency } from '../../utils/format'
import { Badge } from '../common/Badge'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { getTotalAvailable } = useAppData()

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.slug}`} className="block">
        <div className={`relative h-56 bg-linear-to-br ${product.accent}`}>
          <img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-screen opacity-85" />
          <div className="absolute left-4 top-4">
            <Badge tone="info">{product.category}</Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">{product.brand}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-950">{product.name}</h2>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
              <Star size={16} fill="currentColor" />
              {product.rating}
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
              <p className="text-xs text-slate-500">{getTotalAvailable(product.id)} available network-wide</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-cyan-700">
              <ArrowRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
