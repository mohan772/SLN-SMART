import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
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
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, message: 'Please login to add to cart' };
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data);
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
      const res = await axios.put(`/api/cart/${productId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data);
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
      const res = await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const cartSubtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

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
