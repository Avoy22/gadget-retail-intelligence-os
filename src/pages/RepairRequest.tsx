import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Send, ShieldCheck, Wrench } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PageHeader } from '../components/common/PageHeader'
import { useAppData } from '../context/AppDataContext'
import type { RepairRequest } from '../types'

const schema = z.object({
  customer: z.string().min(2, 'Enter your full name.'),
  email: z.string().email('Enter a valid email.'),
  phone: z.string().optional(),
  productId: z.string().min(1, 'Choose a product.'),
  storeId: z.string().min(1, 'Choose a store.'),
  serialNumber: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  issue: z.string().min(12, 'Describe the issue in a little more detail.'),
})

type RepairForm = z.infer<typeof schema>

export function RepairRequest() {
  const { activeProducts, stores, createRepairRequest } = useAppData()
  const [submitted, setSubmitted] = useState<RepairRequest | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RepairForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: activeProducts[0]?.id ?? '',
      storeId: stores[0]?.id ?? '',
      priority: 'Medium',
    },
  })

  const onSubmit = (values: RepairForm) => {
    createRepairRequest(values)
    setSubmitted({
      id: 'pending',
      productId: values.productId,
      storeId: values.storeId,
      customer: values.customer,
      email: values.email,
      phone: values.phone,
      serialNumber: values.serialNumber,
      issue: values.issue,
      priority: values.priority,
      status: 'New',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    })
    reset()
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div>
        <PageHeader
          eyebrow="Warranty service"
          title="Repair request"
          description="Customer-facing intake for diagnostics, warranty validation, and store drop-off scheduling."
        />
        <div className="grid gap-4">
          {[
            ['Validated intake', 'Capture product, store, issue type, and customer contact details.'],
            ['Retail service queue', 'Requests appear in the admin repairs table for operational follow-up.'],
            ['Frontend-only v1.5', 'Submissions persist locally in this browser through the app data layer.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="text-emerald-700" size={22} />
              <h2 className="mt-3 font-bold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
      <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Wrench size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Service intake</h2>
            <p className="text-sm text-slate-500">No data leaves the browser.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Full name
            <input {...register('customer')} className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
            {errors.customer ? <span className="text-xs text-rose-600">{errors.customer.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <input type="email" {...register('email')} className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Product
            <select {...register('productId')} className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
              {activeProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Preferred store
            <select {...register('storeId')} className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Serial number
            <input placeholder="GT-2026-XXXXX" {...register('serialNumber')} className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Priority
            <select {...register('priority')} className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Issue description
            <textarea rows={5} {...register('issue')} className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
            {errors.issue ? <span className="text-xs text-rose-600">{errors.issue.message}</span> : null}
          </label>
        </div>
        <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60">
          Submit repair request
          <Send size={17} />
        </button>
        {submitted ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            Repair request saved to the admin workflow.
          </div>
        ) : null}
      </form>
    </section>
  )
}
