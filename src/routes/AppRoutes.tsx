import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../components/layout/AdminLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { AdminDashboard } from '../pages/AdminDashboard'
import { Analytics } from '../pages/Analytics'
import { Compare } from '../pages/Compare'
import { CompetitorPrices } from '../pages/CompetitorPrices'
import { Home } from '../pages/Home'
import { Inventory } from '../pages/Inventory'
import { NotFound } from '../pages/NotFound'
import { ProductDetails } from '../pages/ProductDetails'
import { ProductManagement } from '../pages/ProductManagement'
import { Products } from '../pages/Products'
import { RepairRequest } from '../pages/RepairRequest'
import { Repairs } from '../pages/Repairs'
import { Reservations } from '../pages/Reservations'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="compare" element={<Compare />} />
          <Route path="repair-request" element={<RepairRequest />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="repairs" element={<Repairs />} />
          <Route path="competitors" element={<CompetitorPrices />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
