import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

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
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data.data.items.map(item => item.product));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to your wishlist', 'error');
      return;
    }

    const isOurs = wishlist.some(p => p._id === product._id);
    
    // Optimistic update
    if (isOurs) {
      setWishlist(prev => prev.filter(p => p._id !== product._id));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      showToast('Added to wishlist', 'success');
    }

    try {
      const token = localStorage.getItem('token');
      if (isOurs) {
        await axios.delete(`/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/wishlist', { productId: product._id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      // Revert on failure
      fetchWishlist();
      showToast('Failed to update wishlist', 'error');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
