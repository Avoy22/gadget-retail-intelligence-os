export type ProductCategory =
  | 'Smartphones'
  | 'Tablets'
  | 'Smartwatches'
  | 'Audio'
  | 'Laptops'
  | 'Gaming'
  | 'Accessories'
  | 'Smart Home'

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  description: string
  price: number
  msrp: number
  rating: number
  reviews: number
  image: string
  accent: string
  specs: Record<string, string>
  tags: string[]
  warrantyMonths: number
}

export type Store = {
  id: string
  name: string
  city: string
  region: string
  type: 'Flagship' | 'Mall' | 'Express' | 'Outlet'
}

export type InventoryItem = {
  id: string
  productId: string
  storeId: string
  stock: number
  reserved: number
  reorderPoint: number
  updatedAt: string
}

export type Reservation = {
  id: string
  productId: string
  storeId: string
  customer: string
  date: string
  status: 'Ready' | 'Pending pickup' | 'Expired' | 'Cancelled'
}

export type RepairRequest = {
  id: string
  productId: string
  storeId: string
  customer: string
  issue: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'New' | 'Diagnosing' | 'Waiting parts' | 'Ready' | 'Closed'
  createdAt: string
}

export type CompetitorPrice = {
  id: string
  productId: string
  competitor: string
  price: number
  checkedAt: string
  availability: 'In stock' | 'Limited' | 'Out of stock'
}

export type SalesMetric = {
  month: string
  revenue: number
  units: number
  margin: number
}

export type CategoryMetric = {
  category: ProductCategory
  revenue: number
  growth: number
}
