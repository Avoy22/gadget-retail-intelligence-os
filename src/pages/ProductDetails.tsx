import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldCheck, Star, Truck } from 'lucide-react'
import { AvailabilityTable } from '../components/products/AvailabilityTable'
import { Badge } from '../components/common/Badge'
import { PageHeader } from '../components/common/PageHeader'
import { useAppData } from '../context/AppDataContext'
import { formatCurrency } from '../utils/format'
import { NotFound } from './NotFound'

export function ProductDetails() {
  const { slug } = useParams()
  const { activeProducts, createReservation, getInventoryForProduct, getProductBySlug, getTotalAvailable, stores } = useAppData()
  const [reservation, setReservation] = useState({ customer: '', email: '', phone: '', storeId: stores[0]?.id ?? '' })
  const [reserved, setReserved] = useState(false)
  const product = getProductBySlug(slug)

  if (!product || product.status !== 'active') return <NotFound />

  const availability = getInventoryForProduct(product.id)
  const related = activeProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3)
  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createReservation({ ...reservation, productId: product.id })
    setReservation({ customer: '', email: '', phone: '', storeId: stores[0]?.id ?? '' })
    setReserved(true)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
        <ArrowLeft size={16} />
        Back to catalog
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className={`overflow-hidden rounded-lg bg-linear-to-br ${product.accent}`}>
          <img src={product.image} alt={product.name} className="h-full min-h-105 w-full object-cover mix-blend-screen opacity-90" />
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="info">{product.category}</Badge>
            {product.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <PageHeader title={product.name} eyebrow={product.brand} description={product.description} />
          <div className="mb-6 flex flex-wrap items-center gap-5">
            <p className="text-4xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
            <p className="text-sm text-slate-500 line-through">{formatCurrency(product.msrp)}</p>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
              <Star size={17} fill="currentColor" />
              {product.rating} from {product.reviews.toLocaleString()} reviews
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <Truck className="text-cyan-700" size={22} />
              <p className="mt-3 font-semibold text-slate-950">{getTotalAvailable(product.id)} units available</p>
              <p className="text-sm text-slate-500">Across the store network</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <ShieldCheck className="text-emerald-700" size={22} />
              <p className="mt-3 font-semibold text-slate-950">{product.warrantyMonths} month warranty</p>
              <p className="text-sm text-slate-500">Repair request workflow ready</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-950">Key specifications</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(product.specs).map(([label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-emerald-600" size={17} />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{label}</p>
                    <p className="font-semibold text-slate-950">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={submitReservation} className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Reserve for pickup</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required value={reservation.customer} onChange={(event) => setReservation((current) => ({ ...current, customer: event.target.value }))} placeholder="Full name" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
              <input required type="email" value={reservation.email} onChange={(event) => setReservation((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
              <input value={reservation.phone} onChange={(event) => setReservation((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
              <select value={reservation.storeId} onChange={(event) => setReservation((current) => ({ ...current, storeId: event.target.value }))} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white hover:bg-cyan-800">
              Reserve product
              <CheckCircle2 size={17} />
            </button>
            {reserved ? <p className="mt-3 text-sm font-semibold text-emerald-700">Reservation saved for admin pickup workflow.</p> : null}
          </form>
        </div>
      </div>
      <div className="mt-10">
        <PageHeader title="Store-wise availability" description="Mock inventory signals show stock, reservations, and reorder status per store." />
        <AvailabilityTable items={availability} />
      </div>
      {related.length ? (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-950">Related products</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} to={`/products/${item.slug}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md">
                <p className="text-sm font-semibold text-slate-500">{item.brand}</p>
                <p className="mt-1 font-bold text-slate-950">{item.name}</p>
                <p className="mt-2 text-sm text-cyan-700">{formatCurrency(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
