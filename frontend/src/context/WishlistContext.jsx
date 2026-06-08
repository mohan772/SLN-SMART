import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { createToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = res.data.data?.items ?? [];
      setWishlist(items.map(item => item.product || item));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      createToast('Please login to add items to your wishlist', 'error');
      return;
    }

    const productId = product._id || product.id;
    const isOurs = wishlist.some(p => (p._id || p.id) === productId);
    
    // Optimistic update
    if (isOurs) {
      setWishlist(prev => prev.filter(p => (p._id || p.id) !== productId));
      createToast('Removed from wishlist', 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      createToast('Added to wishlist', 'success');
    }

    try {
      const token = localStorage.getItem('token');
      if (isOurs) {
        await api.delete(`/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/wishlist', { productId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      // Revert on failure
      fetchWishlist();
      createToast('Failed to update wishlist', 'error');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => (p._id || p.id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
