import { inventory, products, stores } from './mockData'

export const getProduct = (productId: string) =>
  products.find((product) => product.id === productId)

export const getProductBySlug = (slug: string | undefined) =>
  products.find((product) => product.slug === slug)

export const getStore = (storeId: string) => stores.find((store) => store.id === storeId)

export const getInventoryForProduct = (productId: string) =>
  inventory.filter((item) => item.productId === productId)

export const getTotalAvailable = (productId: string) =>
  getInventoryForProduct(productId).reduce(
    (total, item) => total + Math.max(0, item.stock - item.reserved),
    0,
  )
