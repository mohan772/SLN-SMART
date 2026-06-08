import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data || { items: [] });
    } catch (err) {
      console.error(err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, message: 'Please login to add to cart' };
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.post('/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data || cart);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.put(`/cart/${productId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data || cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data || cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const cartItems = cart?.items || [];
    if (user && cartItems.length > 0) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await Promise.all(
          cartItems.map((item) => {
            const productId = item.product?._id || item.product?.id;
            return api.delete(`/cart/${productId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          })
        );
      } catch (err) {
        console.error('Failed to clear cart:', err);
      } finally {
        setLoading(false);
      }
    }
    setCart({ items: [] });
  };

  const cartItems = cart?.items || [];
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
