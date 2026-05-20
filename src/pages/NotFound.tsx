import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, SearchX } from 'lucide-react'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm shadow-slate-950/5">
        <SearchX size={40} />
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-cyan-700">Lost route</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
        The route you requested is not part of this frontend-only retail intelligence build.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Return home
        </Link>
        <Link
          to="/products"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Compass size={16} />
          Browse catalog
        </Link>
      </div>
    </section>
  )
}
