import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/currency';
import { Link, useNavigate } from 'react-router-dom';

const CompareDrawer = ({ isOpen, onClose }) => {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { createToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res?.success) {
      createToast(`${product.name} added to cart!`);
    } else {
      createToast(res?.message || 'Failed to add to cart', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-beige">
          <div>
            <h2 className="text-2xl font-serif font-bold text-forest">Compare Products</h2>
            <p className="text-olive text-sm">{compareList.length} items selected</p>
          </div>
          <div className="flex items-center gap-4">
            {compareList.length > 0 && (
              <button 
                onClick={clearCompare}
                className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 bg-soft-white rounded-full text-olive hover:text-forest transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {compareList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-olive">
              <Scale size={48} className="mb-4 text-beige" />
              <h3 className="text-xl font-bold text-forest mb-2">Nothing to compare</h3>
              <p className="mb-6">Add products to comparison to see them here.</p>
              <button onClick={() => { onClose(); navigate('/shop'); }} className="btn-premium px-6 py-2">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex gap-6 pb-6 overflow-x-auto custom-scrollbar">
              {compareList.map((product) => (
                <div key={product._id} className="min-w-[250px] max-w-[250px] bg-soft-white rounded-3xl p-4 border border-beige flex flex-col relative">
                  <button 
                    onClick={() => toggleCompare(product)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full text-rose-500 shadow-sm hover:scale-110 transition-transform z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                  <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-2xl mb-4" />
                  <Link to={`/product/${product._id}`} onClick={onClose} className="text-lg font-bold text-forest mb-1 hover:text-gold transition-colors line-clamp-1">{product.name}</Link>
                  <div className="text-gold text-xs font-bold uppercase tracking-wider mb-4">{product.categorySlug}</div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between border-b border-beige pb-2">
                      <span className="text-olive text-sm">Price</span>
                      <span className="font-bold text-forest">{formatINR(product.discountPrice || product.price)}</span>
                    </div>
                    <div className="flex justify-between border-b border-beige pb-2">
                      <span className="text-olive text-sm">Weight/Unit</span>
                      <span className="font-bold text-forest">{product.unit}</span>
                    </div>
                    <div className="flex justify-between border-b border-beige pb-2">
                      <span className="text-olive text-sm">Rating</span>
                      <span className="font-bold text-forest">{product.rating} / 5</span>
                    </div>
                    <div className="flex justify-between border-b border-beige pb-2">
                      <span className="text-olive text-sm">Organic</span>
                      <span className={`font-bold ${product.isOrganic ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {product.isOrganic ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {product.nutritionalInfo && (
                      <div className="border-b border-beige pb-2">
                        <span className="text-olive text-sm block mb-1">Calories</span>
                        <span className="font-bold text-forest">{product.nutritionalInfo.calories || 'N/A'}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full btn-premium py-2 mt-6 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
              
              {compareList.length < 4 && (
                <div className="min-w-[250px] max-w-[250px] border-2 border-dashed border-beige rounded-3xl flex flex-col items-center justify-center p-6 text-olive hover:border-gold hover:text-gold transition-colors cursor-pointer" onClick={() => { onClose(); navigate('/shop'); }}>
                  <div className="w-12 h-12 rounded-full bg-soft-white flex items-center justify-center mb-4">
                    <span className="text-2xl">+</span>
                  </div>
                  <span className="font-bold">Add another product</span>
                  <span className="text-xs mt-2">({4 - compareList.length} slots left)</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompareDrawer;
