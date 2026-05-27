import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/cards/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { createToast } = useToast();

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res?.success) {
      createToast(`${product.name} added to cart!`);
    } else {
      createToast(res?.message || 'Failed to add to cart', 'error');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-soft-white">
      {/* Header */}
      <div className="bg-forest py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-bold text-cream mb-2"
          >
            My Wishlist
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-cream/70"
          >
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4].map(n => (
               <div key={n} className="bg-white h-80 rounded-[2rem] animate-pulse border border-beige"></div>
             ))}
           </div>
        ) : wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center max-w-2xl mx-auto border border-beige shadow-sm"
          >
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-forest mb-4">Your wishlist is empty</h2>
            <p className="text-olive mb-8">Save your favorite organic products here and buy them whenever you're ready.</p>
            <Link to="/shop" className="btn-premium px-8 py-3">
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlist.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
