import { useState } from 'react'
import { CheckCircle2, Send, ShieldCheck, Wrench } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { products, stores } from '../data/mockData'

export function RepairRequest() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div>
        <PageHeader
          eyebrow="Warranty service"
          title="Repair request"
          description="A polished customer-facing intake UI for device diagnostics, warranty validation, and store drop-off scheduling."
        />
        <div className="grid gap-4">
          {[
            ['Serial-aware intake', 'Capture product, store, issue type, and customer contact details.'],
            ['Retail service queue', 'Requests appear in the admin repairs table for operational follow-up.'],
            ['Frontend-only v1', 'This form simulates submission locally without backend integration.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="text-emerald-700" size={22} />
              <h2 className="mt-3 font-bold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
      <form
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Wrench size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Service intake</h2>
            <p className="text-sm text-slate-500">Mock UI, no data leaves the browser.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Full name
            <input required className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <input type="email" required className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Product
            <select required className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
              {products.map((product) => (
                <option key={product.id}>{product.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Preferred store
            <select required className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
              {stores.map((store) => (
                <option key={store.id}>{store.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Serial number
            <input placeholder="GT-2026-XXXXX" className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Priority
            <select className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Issue description
            <textarea rows={5} required className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          </label>
        </div>
        <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white hover:bg-cyan-800">
          Submit repair request
          <Send size={17} />
        </button>
        {submitted ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            Repair request captured in the mock workflow.
          </div>
        ) : null}
      </form>
    </section>
  )
}
