import {
  competitorPrices,
  inventory,
  products,
  repairRequests,
  reservations,
  salesMetrics,
  stores,
} from '../data/mockData'
import { loadFromStorage, saveToStorage } from '../lib/storage'
import type {
  CategoryMetric,
  CompetitorPrice,
  Customer,
  InventoryItem,
  Order,
  Product,
  ProductCategory,
  ProductStatus,
  RepairRequest,
  Reservation,
  SalesMetric,
  Store,
} from '../types'

const STORAGE_KEY = 'gadget-retail-intelligence-os:v1.5'
const SCHEMA_VERSION = 1

export type GadgetDataState = {
  schemaVersion: number
  products: Product[]
  stores: Store[]
  inventory: InventoryItem[]
  reservations: Reservation[]
  repairRequests: RepairRequest[]
  competitorPrices: CompetitorPrice[]
  customers: Customer[]
  orders: Order[]
  salesMetrics: SalesMetric[]
}

export type ProductInput = {
  name: string
  brand: string
  category: ProductCategory
  status: ProductStatus
  description: string
  price: number
  msrp: number
  image: string
  warrantyMonths: number
  tags: string[]
}

export type ReservationInput = {
  productId: string
  storeId: string
  customer: string
  email?: string
  phone?: string
  notes?: string
}

export type RepairRequestInput = {
  productId: string
  storeId: string
  customer: string
  email: string
  phone?: string
  serialNumber?: string
  issue: string
  priority: RepairRequest['priority']
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const today = () => new Date().toISOString().slice(0, 10)

export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeProduct = (product: Product): Product => ({
  ...product,
  status: product.status ?? 'active',
})

const normalizeRepair = (request: RepairRequest): RepairRequest => ({
  ...request,
  email: request.email ?? 'customer@example.com',
  updatedAt: request.updatedAt ?? request.createdAt,
})

const buildInitialState = (): GadgetDataState => ({
  schemaVersion: SCHEMA_VERSION,
  products: clone(products).map(normalizeProduct),
  stores: clone(stores),
  inventory: clone(inventory),
  reservations: clone(reservations),
  repairRequests: clone(repairRequests).map(normalizeRepair),
  competitorPrices: clone(competitorPrices),
  customers: [],
  orders: [],
  salesMetrics: clone(salesMetrics),
})

export function loadGadgetState(): GadgetDataState {
  const stored = loadFromStorage<GadgetDataState>(STORAGE_KEY)
  if (!stored || stored.schemaVersion !== SCHEMA_VERSION) return buildInitialState()

  return {
    ...buildInitialState(),
    ...stored,
    products: stored.products.map(normalizeProduct),
    repairRequests: stored.repairRequests.map(normalizeRepair),
  }
}

export function saveGadgetState(state: GadgetDataState) {
  saveToStorage(STORAGE_KEY, state)
}

export function createProduct(input: ProductInput): Product {
  const id = createId('p')
  return {
    id,
    slug: slugify(input.name) || id,
    name: input.name,
    brand: input.brand,
    category: input.category,
    status: input.status,
    description: input.description,
    price: input.price,
    msrp: input.msrp,
    rating: 0,
    reviews: 0,
    image: input.image,
    accent: 'from-cyan-500 to-slate-900',
    specs: {},
    tags: input.tags,
    warrantyMonths: input.warrantyMonths,
  }
}

export function createReservation(input: ReservationInput): Reservation {
  return {
    id: createId('r'),
    productId: input.productId,
    storeId: input.storeId,
    customer: input.customer,
    email: input.email,
    phone: input.phone,
    date: today(),
    status: 'Pending pickup',
    notes: input.notes,
  }
}

export function createRepairRequest(input: RepairRequestInput): RepairRequest {
  const createdAt = today()
  return {
    id: createId('svc'),
    productId: input.productId,
    storeId: input.storeId,
    customer: input.customer,
    email: input.email,
    phone: input.phone,
    serialNumber: input.serialNumber,
    issue: input.issue,
    priority: input.priority,
    status: 'New',
    technicianNotes: '',
    createdAt,
    updatedAt: createdAt,
  }
}

export function deriveCategoryMetrics(state: GadgetDataState): CategoryMetric[] {
  const totals = new Map<ProductCategory, number>()

  state.products.forEach((product) => {
    const available = state.inventory
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + Math.max(0, item.stock - item.reserved), 0)
    totals.set(product.category, (totals.get(product.category) ?? 0) + available * product.price)
  })

  return Array.from(totals.entries()).map(([category, revenue], index) => ({
    category,
    revenue,
    growth: 8 + ((index + Math.round(revenue / 10000)) % 19),
  }))
}

export function deriveSalesMetrics(state: GadgetDataState): SalesMetric[] {
  const inventoryValue = state.inventory.reduce((sum, item) => {
    const product = state.products.find((entry) => entry.id === item.productId)
    return sum + Math.max(0, item.stock - item.reserved) * (product?.price ?? 0)
  }, 0)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return months.map((month, index) => {
    const factor = 0.72 + index * 0.07
    return {
      month,
      revenue: Math.round(inventoryValue * factor),
      units: Math.round(state.inventory.reduce((sum, item) => sum + Math.max(0, item.stock - item.reserved), 0) * factor),
      margin: 18 + index + Math.min(4, state.competitorPrices.length),
    }
  })
}
