import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Minus, Star, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.discount || 0;
  const originalPrice = product.price / (1 - discount / 100);
  const discountBadge = discount > 0;

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart({ ...product, quantity });
      setQuantity(0);
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100">
        {/* Image Container */}
        <div
          className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 z-10 flex gap-2">
            {discountBadge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                {discount}% OFF
              </motion.div>
            )}
            {product.isOrganic && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1"
              >
                <Leaf className="w-3 h-3" />
                ORGANIC
              </motion.div>
            )}
          </div>

          {/* Image */}
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover cursor-pointer"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleProductClick}
          />

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
          >
            <Heart
              className={`w-5 h-5 transition ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </motion.button>

          {/* Quick View */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end"
            >
              <button
                onClick={handleProductClick}
                className="w-full py-3 bg-white text-slate-900 font-bold hover:bg-slate-100 transition"
              >
                Quick View
              </button>
            </motion.div>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-slate-700">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <motion.h3
            className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-emerald-600 transition"
            onClick={handleProductClick}
          >
            {product.name}
          </motion.h3>

          {/* Unit */}
          <p className="text-xs text-slate-500 mb-3">{product.unit || '1 Unit'}</p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-slate-900">
              ₹{product.price.toFixed(0)}
            </span>
            {originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                ₹{originalPrice.toFixed(0)}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Control */}
          {product.stock > 0 ? (
            quantity === 0 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setQuantity(1)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </motion.button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="flex-1 p-2 hover:bg-emerald-100 rounded-lg transition"
                >
                  <Minus className="w-4 h-4 mx-auto text-emerald-600" />
                </motion.button>

                <span className="flex-1 text-center font-bold text-slate-900">
                  {quantity}
                </span>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (quantity < product.stock) {
                      setQuantity(quantity + 1);
                    }
                  }}
                  className="flex-1 p-2 hover:bg-emerald-100 rounded-lg transition"
                >
                  <Plus className="w-4 h-4 mx-auto text-emerald-600" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
                >
                  Add
                </motion.button>
              </div>
            )
          ) : (
            <button disabled className="w-full py-3 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
              Out of Stock
            </button>
          )}

          {/* Stock Indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition ${
                  product.stock > 10
                    ? 'bg-emerald-500'
                    : product.stock > 5
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${(product.stock / 100) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {product.stock} left
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
