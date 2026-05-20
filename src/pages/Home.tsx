import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Boxes, Globe2, ShieldCheck, Sparkles, Store } from 'lucide-react'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { RevenueChart } from '../components/analytics/RevenueChart'
import { Badge } from '../components/common/Badge'
import { StatCard } from '../components/common/StatCard'
import { ProductCard } from '../components/products/ProductCard'
import { useAppData } from '../context/AppDataContext'
import { formatCurrency, formatNumber } from '../utils/format'

const HERO_CATEGORIES = ['Smartphones', 'Laptops', 'Audio'] as const

export function Home() {
  const { activeProducts, categoryMetrics, derivedSalesMetrics, inventory, stores } = useAppData()
  const featured = activeProducts.slice(0, 3)
  const latest = derivedSalesMetrics[derivedSalesMetrics.length - 1]
  const previous = derivedSalesMetrics[derivedSalesMetrics.length - 2]
  const revenueDelta = ((latest.revenue - previous.revenue) / previous.revenue) * 100
  const totalUnits = inventory.reduce((sum, item) => sum + Math.max(0, item.stock - item.reserved), 0)
  const heroAvailability = HERO_CATEGORIES.map((category) => {
    const ids = new Set(activeProducts.filter((product) => product.category === category).map((product) => product.id))
    const units = inventory
      .filter((item) => ids.has(item.productId))
      .reduce((sum, item) => sum + Math.max(0, item.stock - item.reserved), 0)
    return { category, units }
  })

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80"
            alt="Premium electronics retail floor"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-slate-950/20" />
        </div>
        <div className="relative mx-auto grid min-h-170 max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <Badge tone="info">Frontend-only retail intelligence platform</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">Gadget Retail Intelligence OS</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              A premium operating surface for electronics chains to merchandise products, monitor availability, track service requests, and read performance signals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                Explore catalog
                <ArrowRight size={18} />
              </Link>
              <Link to="/admin" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Open admin OS
                <BarChart3 size={18} />
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-5 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">{latest.month} revenue</p>
                <p className="mt-2 text-3xl font-bold">{formatCurrency(latest.revenue)}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">+{revenueDelta.toFixed(1)}% vs last month</p>
              </div>
              <div className="rounded-lg bg-cyan-500 p-5 text-slate-950">
                <p className="text-sm font-semibold">Active stores</p>
                <p className="mt-2 text-3xl font-bold">{stores.length}</p>
                <p className="mt-2 text-sm font-semibold">US, EMEA, APAC, MEA</p>
              </div>
              <div className="rounded-lg bg-slate-900 p-5 text-white sm:col-span-2">
                <p className="text-sm font-semibold text-slate-300">Network availability</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {heroAvailability.map((entry) => (
                    <div key={entry.category} className="rounded-lg bg-white/10 p-3">
                      <p className="text-xs text-slate-300">{entry.category}</p>
                      <p className="mt-1 text-xl font-bold">{formatNumber(entry.units)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Products modeled" value={String(activeProducts.length)} trend="+8 categories" icon={Sparkles} />
          <StatCard label="Retail locations" value={String(stores.length)} trend="Global footprint" icon={Store} />
          <StatCard label="Units in network" value={formatNumber(totalUnits)} trend="Store-level stock" icon={Boxes} />
          <StatCard label="Service workflows" value="4" trend="Warranty requests" icon={ShieldCheck} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700">Featured assortment</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Premium devices with live retail context</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 font-semibold text-cyan-700">
              View all products
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <RevenueChart data={derivedSalesMetrics} />
        <CategoryChart data={categoryMetrics} />
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Globe2 className="text-cyan-300" />
            <p className="text-lg font-semibold">Built for global gadget stores, regional chains, and premium electronics teams.</p>
          </div>
          <Link to="/admin/inventory" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-slate-950">
            Inspect inventory
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
