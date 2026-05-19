import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Boxes,
  CalendarCheck,
  Gauge,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings2,
  ShoppingBag,
  TrendingUp,
  Wrench,
} from 'lucide-react'
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
  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-200 bg-slate-950 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-600">
            <ShoppingBag size={21} />
          </span>
          <div>
            <p className="font-bold">Retail Command</p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Admin OS</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:overflow-visible">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  'flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white',
                  isActive && 'bg-white text-slate-950 hover:bg-white hover:text-slate-950',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-5 py-5 lg:block">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <Gauge className="text-cyan-300" size={22} />
            <p className="mt-3 text-sm font-semibold">Ops health</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">All workflows are powered by local mock data for Vercel-safe deployment.</p>
          </div>
        </div>
      </aside>
      <div>
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-700">Global electronics retail chain</p>
              <h1 className="text-xl font-bold text-slate-950">Operations cockpit</h1>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <ReceiptText size={16} />
              Mock data environment
              <Settings2 size={16} />
            </div>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
