/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  createProduct,
  createRepairRequest as buildRepairRequest,
  createReservation as buildReservation,
  deriveCategoryMetrics,
  deriveSalesMetrics,
  loadGadgetState,
  saveGadgetState,
  type GadgetDataState,
  type ProductInput,
  type RepairRequestInput,
  type ReservationInput,
} from '../services/gadgetRepository'
import type { CompetitorPrice, Product, RepairRequest, Reservation } from '../types'

type AppDataContextValue = GadgetDataState & {
  activeProducts: Product[]
  categoryMetrics: ReturnType<typeof deriveCategoryMetrics>
  derivedSalesMetrics: ReturnType<typeof deriveSalesMetrics>
  getProduct: (productId: string) => Product | undefined
  getProductBySlug: (slug: string | undefined) => Product | undefined
  getInventoryForProduct: (productId: string) => GadgetDataState['inventory']
  getStore: (storeId: string) => GadgetDataState['stores'][number] | undefined
  getTotalAvailable: (productId: string) => number
  addProduct: (input: ProductInput) => void
  updateProduct: (productId: string, updates: Partial<Product>) => void
  deleteProduct: (productId: string) => void
  updateInventoryQuantity: (inventoryItemId: string, stock: number) => void
  createReservation: (input: ReservationInput) => void
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void
  createRepairRequest: (input: RepairRequestInput) => void
  updateRepairStatus: (requestId: string, status: RepairRequest['status']) => void
  updateRepairNotes: (requestId: string, technicianNotes: string) => void
  updateCompetitorPrice: (priceId: string, updates: Partial<CompetitorPrice>) => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

type AppDataProviderProps = {
  children: ReactNode
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  const [state, setState] = useState<GadgetDataState>(() => loadGadgetState())

  useEffect(() => {
    saveGadgetState(state)
  }, [state])

  const value = useMemo<AppDataContextValue>(() => {
    const getProduct = (productId: string) => state.products.find((product) => product.id === productId)
    const getInventoryForProduct = (productId: string) =>
      state.inventory.filter((item) => item.productId === productId)

    return {
      ...state,
      activeProducts: state.products.filter((product) => product.status === 'active'),
      categoryMetrics: deriveCategoryMetrics(state),
      derivedSalesMetrics: deriveSalesMetrics(state),
      getProduct,
      getProductBySlug: (slug) => state.products.find((product) => product.slug === slug),
      getInventoryForProduct,
      getStore: (storeId) => state.stores.find((store) => store.id === storeId),
      getTotalAvailable: (productId) =>
        getInventoryForProduct(productId).reduce(
          (total, item) => total + Math.max(0, item.stock - item.reserved),
          0,
        ),
      addProduct: (input) => {
        const product = createProduct(input)
        setState((current) => ({
          ...current,
          products: [...current.products, product],
          inventory: [
            ...current.inventory,
            ...current.stores.map((store) => ({
              id: `inv-${product.id}-${store.id}`,
              productId: product.id,
              storeId: store.id,
              stock: 0,
              reserved: 0,
              reorderPoint: product.price > 1000 ? 4 : 8,
              updatedAt: new Date().toISOString().slice(0, 10),
            })),
          ],
        }))
      },
      updateProduct: (productId, updates) => {
        setState((current) => ({
          ...current,
          products: current.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product,
          ),
        }))
      },
      deleteProduct: (productId) => {
        setState((current) => ({
          ...current,
          products: current.products.map((product) =>
            product.id === productId ? { ...product, status: 'discontinued' } : product,
          ),
        }))
      },
      updateInventoryQuantity: (inventoryItemId, stock) => {
        setState((current) => ({
          ...current,
          inventory: current.inventory.map((item) =>
            item.id === inventoryItemId
              ? { ...item, stock: Math.max(0, stock), updatedAt: new Date().toISOString().slice(0, 10) }
              : item,
          ),
        }))
      },
      createReservation: (input) => {
        setState((current) => ({
          ...current,
          reservations: [buildReservation(input), ...current.reservations],
        }))
      },
      updateReservationStatus: (reservationId, status) => {
        setState((current) => ({
          ...current,
          reservations: current.reservations.map((reservation) =>
            reservation.id === reservationId ? { ...reservation, status } : reservation,
          ),
        }))
      },
      createRepairRequest: (input) => {
        setState((current) => ({
          ...current,
          repairRequests: [buildRepairRequest(input), ...current.repairRequests],
        }))
      },
      updateRepairStatus: (requestId, status) => {
        setState((current) => ({
          ...current,
          repairRequests: current.repairRequests.map((request) =>
            request.id === requestId
              ? { ...request, status, updatedAt: new Date().toISOString().slice(0, 10) }
              : request,
          ),
        }))
      },
      updateRepairNotes: (requestId, technicianNotes) => {
        setState((current) => ({
          ...current,
          repairRequests: current.repairRequests.map((request) =>
            request.id === requestId
              ? { ...request, technicianNotes, updatedAt: new Date().toISOString().slice(0, 10) }
              : request,
          ),
        }))
      },
      updateCompetitorPrice: (priceId, updates) => {
        setState((current) => ({
          ...current,
          competitorPrices: current.competitorPrices.map((price) =>
            price.id === priceId ? { ...price, ...updates, checkedAt: new Date().toISOString().slice(0, 10) } : price,
          ),
        }))
      },
    }
  }, [state])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) throw new Error('useAppData must be used inside AppDataProvider')
  return context
}
