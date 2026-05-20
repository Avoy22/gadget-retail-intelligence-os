import { Link, NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Menu, ShoppingBag, Sparkles, Wrench, X } from 'lucide-react'
import { useState } from 'react'
import { cx } from '../../utils/format'

const navItems = [
  { to: '/products', label: 'Products' },
  { to: '/compare', label: 'Compare' },
  { to: '/repair-request', label: 'Repairs' },
  { to: '/admin', label: 'Admin OS' },
]

export function PublicLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <ShoppingBag size={20} />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight text-slate-950">Gadget Retail</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Intelligence OS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'rounded-2xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950',
                    isActive && 'bg-slate-950 text-white shadow-sm hover:bg-slate-950 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/analytics" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-950/5 transition hover:border-slate-300 hover:bg-slate-50">
              <BarChart3 size={16} />
              Live analytics
            </Link>
            <Link to="/repair-request" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-cyan-700 px-4 text-sm font-semibold text-white shadow-sm shadow-cyan-900/20 transition hover:bg-cyan-800">
              <Wrench size={16} />
              Service
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cx('rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700', isActive && 'bg-slate-950 text-white')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold text-slate-700">Gadget Retail Intelligence OS. Frontend-only portfolio build.</p>
          <p className="inline-flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-700" />
            Mock data, retail analytics, product operations, and service workflows.
          </p>
        </div>
      </footer>
    </div>
  )
}
