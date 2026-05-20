import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Send, ShieldCheck, Wrench } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Input, Select, Textarea } from '../components/common/FormControls'
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
            <Card key={title} className="p-5" interactive>
              <ShieldCheck className="text-emerald-700" size={22} />
              <h2 className="mt-3 font-bold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
            </Card>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Wrench size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Service intake</h2>
            <p className="text-sm text-slate-500">No data leaves the browser.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" {...register('customer')} error={errors.customer?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Select label="Product" {...register('productId')}>
              {activeProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
          </Select>
          <Select label="Preferred store" {...register('storeId')}>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
          </Select>
          <Input label="Serial number" placeholder="GT-2026-XXXXX" {...register('serialNumber')} helper="Optional, but useful for warranty triage." />
          <Select label="Priority" {...register('priority')}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
          </Select>
          <Textarea label="Issue description" rows={5} {...register('issue')} error={errors.issue?.message} fieldClassName="md:col-span-2" />
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-5" fullWidth icon={<Send size={17} />}>
          Submit repair request
        </Button>
        {submitted ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            <CheckCircle2 size={18} />
            Repair request saved to the admin workflow.
          </div>
        ) : null}
        </Card>
      </form>
    </section>
  )
}
