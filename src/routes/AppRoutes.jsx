import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout   from '@/layouts/MainLayout'
import AdminLayout  from '@/layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute     from './AdminRoute'

// Public pages
import Home          from '@/pages/Home'
import Shop          from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart          from '@/pages/Cart'
import Login         from '@/pages/Login'
import Register      from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import NotFound      from '@/pages/NotFound'

// Protected user pages
import Checkout     from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import Profile      from '@/pages/Profile'
import Orders       from '@/pages/Orders'

// Admin pages
import Dashboard          from '@/pages/admin/Dashboard'
import ProductsManagement from '@/pages/admin/ProductsManagement'
import ProductForm        from '@/pages/admin/ProductForm'
import CategoriesManagement from '@/pages/admin/CategoriesManagement'
import OrdersManagement   from '@/pages/admin/OrdersManagement'
import UsersManagement    from '@/pages/admin/UsersManagement'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main user layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop"              element={<Shop />} />
        <Route path="products/:id"      element={<ProductDetail />} />
        <Route path="cart"              element={<Cart />} />
        <Route path="login"             element={<Login />} />
        <Route path="register"          element={<Register />} />
        <Route path="forgot-password"   element={<ForgotPassword />} />

        {/* Protected user routes */}
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      </Route>

      {/* Admin layout */}
      <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"              element={<Dashboard />} />
        <Route path="products"               element={<ProductsManagement />} />
        <Route path="products/new"           element={<ProductForm />} />
        <Route path="products/:id/edit"      element={<ProductForm />} />
        <Route path="categories"             element={<CategoriesManagement />} />
        <Route path="orders"                 element={<OrdersManagement />} />
        <Route path="users"                  element={<UsersManagement />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
