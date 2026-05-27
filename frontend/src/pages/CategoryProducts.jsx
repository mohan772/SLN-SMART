import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  Heart,
  Eye,
  X,
  Leaf,
  ArrowUpDown,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';

const CategoryProducts = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const { addToCart } = useCart();
  const { createToast } = useToast();
  
  const [sortBy, setSortBy] = useState('-createdAt');
  const [categoryDetails, setCategoryDetails] = useState({
    name: categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: 'Fresh and premium quality products sourced directly from farms.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'
  });

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `/api/products/category/${categorySlug}?sort=${sortBy}`;
      
      const res = await axios.get(url);
      setProducts(res.data.data);
      
      // If we have products, extract category info from the first product
      if (res.data.data.length > 0 && res.data.data[0].category) {
        const cat = res.data.data[0].category;
        setCategoryDetails({
          name: cat.name,
          description: cat.description || categoryDetails.description,
          image: cat.image || categoryDetails.image
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res?.success) {
      createToast(`${product.name} added to cart!`);
    } else {
      createToast(res?.message || 'Failed to add to cart. Please login.', 'error');
    }
  };

  const handleAddToWishlist = (product) => {
    createToast(`${product.name} added to wishlist!`);
  };

  return (
    <div className="pt-24 min-h-screen bg-soft-white">
      {/* Category Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-forest">
        <div className="absolute inset-0 z-0">
          <img 
            src={categoryDetails.image} 
            className="w-full h-full object-cover opacity-40"
            alt={categoryDetails.name}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
          {/* Breadcrumb */}
          <nav className="flex items-center text-cream/70 text-sm font-medium mb-4">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-cream">{categoryDetails.name}</span>
          </nav>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-cream mb-4"
          >
            {categoryDetails.name}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-cream/80 max-w-xl text-lg"
          >
            {categoryDetails.description}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-beige/50 flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-olive font-medium">
                Found <span className="text-forest font-bold text-lg">{products.length}</span> products in this category
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-soft-white rounded-xl p-1">
                <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gold' : 'text-olive'}`}
                >
                  <Grid size={20} />
                </button>
                <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gold' : 'text-olive'}`}
                >
                  <List size={20} />
                </button>
              </div>

              <div className="relative group">
                <select 
                className="appearance-none bg-soft-white border border-beige rounded-xl px-4 py-2 pr-10 text-sm font-bold text-forest outline-none cursor-pointer focus:ring-2 focus:ring-gold"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="-createdAt">Newest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Top Rated</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-2.5 text-olive pointer-events-none" size={16} />
              </div>
            </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white h-80 rounded-[2rem] animate-pulse border border-beige"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" 
            : "space-y-6"
          }>
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product._id}
                  className={`card-premium group ${viewMode === 'list' ? 'flex flex-col md:flex-row p-6 items-center gap-8' : 'p-4'}`}
                >
                  <div className={`relative overflow-hidden rounded-[1.5rem] bg-soft-white ${viewMode === 'list' ? 'w-full md:w-64 h-48 flex-shrink-0' : 'h-64 mb-6'}`}>
                    <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.images[0] || 'https://images.unsplash.com/photo-1597362868123-a5563b014a04'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={product.name} 
                      />
                    </Link>
                    {product.discountPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        SALE
                      </div>
                    )}
                    {product.isOrganic && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <Leaf size={14} />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 pointer-events-none">
                        <button 
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest hover:bg-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto"
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                        onClick={(e) => { e.preventDefault(); handleAddToWishlist(product); }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest hover:bg-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 pointer-events-auto"
                        >
                          <Heart size={18} />
                        </button>
                        <Link to={`/product/${product._id}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest hover:bg-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-700 pointer-events-auto">
                          <Eye size={18} />
                        </Link>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{categoryDetails.name}</span>
                        <div className="flex items-center text-sm font-bold text-forest">
                          <Star size={14} className="text-gold fill-gold mr-1" /> {product.rating || '4.5'}
                        </div>
                    </div>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xl font-serif font-bold text-forest mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
                    </Link>
                    <p className={`text-olive text-sm mb-4 line-clamp-2 ${viewMode === 'list' ? 'block' : 'hidden'}`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-serif font-bold text-forest">{formatINR(product.price)}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-olive line-through font-medium">{formatINR(product.discountPrice)}</span>
                        )}
                        <span className="text-xs text-olive">/ {product.unit}</span>
                      </div>
                      <button onClick={() => handleAddToCart(product)} className="w-10 h-10 bg-forest text-cream rounded-xl flex items-center justify-center hover:bg-olive transition-all">
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-beige/50">
              <div className="w-20 h-20 bg-soft-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-olive" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-forest mb-2">No Products Found</h3>
              <p className="text-olive">There are currently no products in this category.</p>
              <Link to="/shop" className="mt-6 inline-block text-gold font-bold hover:underline">
                Return to Shop
              </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
