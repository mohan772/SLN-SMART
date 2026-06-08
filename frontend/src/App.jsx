import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import UserDashboard from './pages/UserDashboard';
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import UserManagement from './pages/admin/UserManagement';

function App() {

  return (
    <Routes>
      {/* Public / Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/category/:categorySlug" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/payment-success" 
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Admin Layout */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute isAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="customers" element={<UserManagement />} />
        <Route path="analytics" element={<div className="p-8">Detailed Analytics coming soon...</div>} />

        <Route path="offers" element={<div className="p-8">Offers & Discounts coming soon...</div>} />
        <Route path="settings" element={<div className="p-8">Admin Settings coming soon...</div>} />
      </Route>
    </Routes>
  );
}

export default App;
