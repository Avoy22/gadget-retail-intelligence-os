import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Globe2,
  Layers3,
  LineChart,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
} from 'lucide-react'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { RevenueChart } from '../components/analytics/RevenueChart'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { ProductCard } from '../components/products/ProductCard'
import { useAppData } from '../context/AppDataContext'
import { formatCurrency, formatNumber } from '../utils/format'

const HERO_CATEGORIES = ['Smartphones', 'Laptops', 'Audio'] as const

const valueCards = [
  {
    title: 'Merchandising control',
    copy: 'Manage active, draft, and discontinued electronics assortments with rich product context.',
    icon: Layers3,
  },
  {
    title: 'Store-level inventory',
    copy: 'Spot low-stock risk, reserved units, and store availability without leaving the command view.',
    icon: Boxes,
  },
  {
    title: 'Service operations',
    copy: 'Capture warranty intake and route repairs into an admin queue for follow-up.',
    icon: Wrench,
  },
]

export function Home() {
  const { activeProducts, categoryMetrics, derivedSalesMetrics, inventory, stores } = useAppData()
  const featured = activeProducts.slice(0, 3)
  const latest = derivedSalesMetrics[derivedSalesMetrics.length - 1]
  const previous = derivedSalesMetrics[derivedSalesMetrics.length - 2]
  const revenueDelta =
    previous && previous.revenue > 0
      ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
      : 0
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
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-slate-950/25" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-slate-50 to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-170 max-w-7xl items-center gap-10 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <Badge tone="info" className="border-cyan-300/40 bg-cyan-300/15 text-cyan-100">
              Frontend-only retail intelligence platform
            </Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">Gadget Retail Intelligence OS</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              A premium operating surface for electronics retailers to merchandise products, monitor store availability, track service requests, and read performance signals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300">
                Explore catalog
                <ArrowRight size={18} />
              </Link>
              <Link to="/admin" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 font-bold text-white backdrop-blur transition hover:bg-white/15">
                Open admin OS
                <BarChart3 size={18} />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-2xl bg-white p-5 text-slate-950">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">{latest.month} revenue</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight">{formatCurrency(latest.revenue)}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">+{revenueDelta.toFixed(1)}%</span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-4/5 rounded-full bg-cyan-500" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {heroAvailability.map((entry) => (
                  <div key={entry.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">{entry.category}</p>
                    <p className="mt-1 text-2xl font-bold">{formatNumber(entry.units)}</p>
                    <p className="mt-1 text-xs text-slate-500">available</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-cyan-400 p-5 text-slate-950">
                <Store size={22} />
                <p className="mt-3 text-sm font-bold">Active stores</p>
                <p className="mt-1 text-3xl font-bold">{stores.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-white">
                <LineChart size={22} className="text-amber-300" />
                <p className="mt-3 text-sm font-bold text-slate-300">Ops signals</p>
                <p className="mt-1 text-3xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Products modeled" value={String(activeProducts.length)} trend="+8 categories" icon={Sparkles} tone="cyan" />
          <StatCard label="Retail locations" value={String(stores.length)} trend="Global footprint" icon={Store} tone="dark" />
          <StatCard label="Units in network" value={formatNumber(totalUnits)} trend="Store-level stock" icon={Boxes} tone="emerald" />
          <StatCard label="Service workflows" value="4" trend="Warranty requests" icon={ShieldCheck} tone="amber" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured assortment"
          title="Premium devices with live retail context"
          description="The catalog presents products as retail-ready SKUs, with pricing, availability, tags, and service context visible from discovery through detail."
          action={
            <Link to="/products" className="inline-flex items-center gap-2 font-bold text-cyan-700">
              View all products
              <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Business value"
            title="Built for global electronics retail teams"
            description="A focused front office and back office experience for catalog operations, stock control, competitive pricing, reservations, and repairs."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <Card key={card.title} className="p-6" interactive>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <card.icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.copy}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <RevenueChart data={derivedSalesMetrics} />
        <CategoryChart data={categoryMetrics} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
            <div>
              <Badge tone="info" className="border-cyan-300/40 bg-cyan-300/15 text-cyan-100">
                Admin dashboard preview
              </Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">A command center for daily retail execution</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Start with revenue and inventory risk, then move into reservations, repairs, competitor prices, and merchandising actions.
              </p>
              <Link to="/admin" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 font-bold text-slate-950">
                Launch admin OS
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid gap-3">
              {['Low-stock alerts grouped by store', 'Reservation pickup status controls', 'Repair priority and technician notes', 'Competitor pricing deltas'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  <span className="text-sm font-semibold text-slate-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Globe2 className="text-cyan-300" />
            <p className="text-lg font-semibold">Built for global gadget stores, regional chains, and premium electronics teams.</p>
          </div>
          <Link to="/admin/inventory" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 font-bold text-slate-950">
            Inspect inventory
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
