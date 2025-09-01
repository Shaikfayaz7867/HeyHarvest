import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import HealthBenefits from './pages/HealthBenefits'
import Process from './pages/Process'
import Certifications from './pages/Certifications'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/auth/VerifyOTP'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/health-benefits" element={<HealthBenefits />} />
              <Route path="/process" element={<Process />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />

              {/* Protected User Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/orders/:orderId" element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
              <Route path="/admin/customers" element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster 
            position="bottom-left"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2D5016',
                color: '#fff',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
