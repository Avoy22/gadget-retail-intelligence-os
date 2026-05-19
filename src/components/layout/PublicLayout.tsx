import { Link, NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Menu, ShoppingBag, Wrench, X } from 'lucide-react'
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
              <ShoppingBag size={20} />
            </span>
            <span>
              <span className="block text-base font-bold text-slate-950">Gadget Retail</span>
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
                    'rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    isActive && 'bg-slate-950 text-white hover:bg-slate-950 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/analytics" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
              <BarChart3 size={16} />
              Live analytics
            </Link>
            <Link to="/repair-request" className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800">
              <Wrench size={16} />
              Service
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cx('rounded-lg px-3 py-2 text-sm font-semibold text-slate-700', isActive && 'bg-slate-950 text-white')
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
          <p>Gadget Retail Intelligence OS. Frontend-only portfolio build.</p>
          <p>Mock data, retail analytics, product operations, and service workflows.</p>
        </div>
      </footer>
    </div>
  )
}
