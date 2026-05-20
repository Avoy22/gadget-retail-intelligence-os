import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, GitCompareArrows, ShieldCheck, Star, Truck } from 'lucide-react'
import { AvailabilityTable } from '../components/products/AvailabilityTable'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card, CardHeader } from '../components/common/Card'
import { Input, Select } from '../components/common/FormControls'
import { PageHeader } from '../components/common/PageHeader'
import { SectionHeader } from '../components/common/SectionHeader'
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
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950">
        <ArrowLeft size={16} />
        Back to catalog
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className={`overflow-hidden rounded-2xl bg-linear-to-br ${product.accent} shadow-2xl shadow-slate-950/10`}>
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
            <Card className="p-4">
              <Truck className="text-cyan-700" size={22} />
              <p className="mt-3 font-semibold text-slate-950">{getTotalAvailable(product.id)} units available</p>
              <p className="text-sm text-slate-500">Across the store network</p>
            </Card>
            <Card className="p-4">
              <ShieldCheck className="text-emerald-700" size={22} />
              <p className="mt-3 font-semibold text-slate-950">{product.warrantyMonths} month warranty</p>
              <p className="text-sm text-slate-500">Repair request workflow ready</p>
            </Card>
          </div>
          <Card className="mt-6 p-5">
            <h2 className="text-lg font-bold text-slate-950">Key specifications</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(product.specs).map(([label, value]) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 text-emerald-600" size={17} />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{label}</p>
                    <p className="font-semibold text-slate-950">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <form onSubmit={submitReservation} className="mt-6">
            <Card>
              <CardHeader title="Reserve for pickup" description="Create a local reservation that appears in the admin pickup workflow." />
              <div className="p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input required label="Full name" value={reservation.customer} onChange={(event) => setReservation((current) => ({ ...current, customer: event.target.value }))} placeholder="Customer name" />
                  <Input required label="Email" type="email" value={reservation.email} onChange={(event) => setReservation((current) => ({ ...current, email: event.target.value }))} placeholder="name@example.com" />
                  <Input label="Phone" value={reservation.phone} onChange={(event) => setReservation((current) => ({ ...current, phone: event.target.value }))} placeholder="Optional phone" />
                  <Select label="Pickup store" value={reservation.storeId} onChange={(event) => setReservation((current) => ({ ...current, storeId: event.target.value }))}>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button type="submit" className="mt-4" fullWidth icon={<CheckCircle2 size={17} />}>
                  Reserve product
                </Button>
                {reserved ? (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                    <CheckCircle2 size={16} />
                    Reservation saved for admin pickup workflow.
                  </div>
                ) : null}
              </div>
            </Card>
          </form>
        </div>
      </div>
      <div className="mt-10">
        <SectionHeader title="Store-wise availability" description="Mock inventory signals show stock, reservations, and reorder status per store." />
        <AvailabilityTable items={availability} />
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="bg-slate-950 p-6 text-white">
          <GitCompareArrows className="text-cyan-300" size={24} />
          <h2 className="mt-4 text-2xl font-bold">Compare before merchandising</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Drop this product into the comparison workflow to review price, warranty, specs, and tags against adjacent SKUs.</p>
          <Link to="/compare" className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-slate-950">
            Open comparison
            <ArrowRight size={16} />
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-slate-950">Recommended bundle cues</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {['Protection plan', 'Fast charger', 'Premium audio'].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-bold text-slate-950">{item}</p>
                <p className="mt-1 text-sm text-slate-500">Attach during reservation or assisted checkout.</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {related.length ? (
        <div className="mt-10">
          <SectionHeader title="Related products" description="Alternative SKUs from the same category for upsell or substitution." />
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} to={`/products/${item.slug}`} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/10">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.brand}</p>
                <p className="mt-2 font-bold text-slate-950">{item.name}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-base font-bold text-cyan-700">{formatCurrency(item.price)}</p>
                  <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-700" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
