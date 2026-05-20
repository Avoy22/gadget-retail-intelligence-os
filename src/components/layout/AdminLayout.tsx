import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Boxes,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Gauge,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  Settings2,
  ShoppingBag,
  TrendingUp,
  Wrench,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { cx } from '../../utils/format'

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/admin/repairs', label: 'Repairs', icon: Wrench },
  { to: '/admin/competitors', label: 'Competitors', icon: TrendingUp },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const today = format(new Date(), 'EEEE, MMM d')

  const navList = (
    <nav className="grid gap-1.5">
      {adminNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cx(
              'group flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white',
              isActive && 'bg-white text-slate-950 shadow-lg shadow-black/20 hover:bg-white hover:text-slate-950',
            )
          }
        >
          <span className="flex items-center gap-3">
            <item.icon size={18} />
            {item.label}
          </span>
          <ChevronRight size={15} className="opacity-0 transition group-hover:opacity-100" />
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden flex-col border-r border-slate-800 bg-slate-950 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/30">
            <ShoppingBag size={21} />
          </span>
          <div>
            <p className="font-bold tracking-tight">Retail Command</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">Admin OS</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">{navList}</div>
        <div className="px-4 pb-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/10">
            <Gauge className="text-cyan-300" size={22} />
            <p className="mt-3 text-sm font-semibold">Ops health</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              All workflows are powered by local mock data for Vercel-safe deployment.
            </p>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-slate-950 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/30">
                  <ShoppingBag size={20} />
                </span>
                <div>
                  <p className="font-bold tracking-tight">Retail Command</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">Admin OS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">{navList}</div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Global electronics retail chain</p>
                  <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Operations cockpit</h1>
                </div>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                  <CalendarDays size={16} className="text-cyan-700" />
                  {today}
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>
                <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-2.5 pr-3.5 shadow-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">AD</span>
                  <div className="hidden text-left leading-tight lg:block">
                    <p className="text-xs font-bold text-slate-950">Admin</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Retail ops</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative flex-1 lg:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="search"
                  placeholder="Search products, stores, orders…"
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <div className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm">
                <Settings2 size={14} />
                <span className="hidden sm:inline">Mock data environment</span>
                <span className="inline sm:hidden">Mock</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
