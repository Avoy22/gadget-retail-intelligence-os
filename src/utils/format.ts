import type { InventoryItem } from '../types'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

export const getStockStatus = (item: InventoryItem) => {
  const available = item.stock - item.reserved

  if (available <= 0) return { label: 'Out', tone: 'danger' as const }
  if (available <= item.reorderPoint) return { label: 'Low', tone: 'warning' as const }
  return { label: 'Healthy', tone: 'success' as const }
}

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')
