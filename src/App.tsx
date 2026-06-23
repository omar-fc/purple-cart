import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { ProductListingPage } from '@/pages/ProductListingPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminCategories } from '@/pages/admin/AdminCategories'
import { AdminProducts } from '@/pages/admin/AdminProducts'

/**
 * Route table.
 *
 *  - Public storefront routes share the PublicLayout (nav + footer).
 *  - /admin/login is standalone (no chrome).
 *  - The rest of /admin is wrapped by ProtectedRoute + AdminLayout (sidebar).
 */
export default function App() {
  return (
    // `basename` mirrors Vite's `base` (e.g. "/repo/" on GitHub Pages, "/"
    // locally) so routes resolve under the Pages subpath. import.meta.env.BASE_URL
    // is injected by Vite from the `base` option — single source of truth.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Storefront */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListingPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* Admin login (no layout chrome) */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Protected admin area */}
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
