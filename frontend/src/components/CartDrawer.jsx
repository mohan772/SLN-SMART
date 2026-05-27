import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/currency';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();

  const shipping = 5.00;
  const total = cartSubtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-forest/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-beige flex items-center justify-between bg-cream/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center text-cream">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-serif font-bold text-forest">Your Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-beige flex items-center justify-center transition-colors"
              >
                <X size={24} className="text-forest" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.product._id} className="flex space-x-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-soft-white flex-shrink-0 border border-beige">
                      <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-serif font-bold text-forest group-hover:text-gold transition-colors">{item.product.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-olive hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-olive mb-3">{formatINR(item.product.price)} / {item.product.unit}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-soft-white rounded-lg p-1 border border-beige">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-forest hover:bg-white rounded-md transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-forest">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-forest hover:bg-white rounded-md transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-bold text-forest">{formatINR(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-soft-white rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-beige" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-forest mb-2">Cart is empty</h3>
                  <p className="text-olive mb-8">Looks like you haven't added anything to your cart yet.</p>
                  <Link 
                    to="/shop" 
                    onClick={onClose}
                    className="btn-premium px-8"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-8 border-t border-beige bg-soft-white">
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-olive">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-olive">
                    <span>Estimated Shipping</span>
                    <span className="font-bold">{formatINR(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-serif font-bold text-forest pt-3 border-t border-beige">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={onClose}
                  className="btn-premium w-full py-4 flex items-center justify-center space-x-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
