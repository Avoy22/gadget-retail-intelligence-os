import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <SearchX className="text-slate-400" size={48} />
      <h1 className="mt-5 text-4xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">The route you requested is not part of this frontend-only retail intelligence build.</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white">
        <ArrowLeft size={17} />
        Return home
      </Link>
    </section>
  )
}
