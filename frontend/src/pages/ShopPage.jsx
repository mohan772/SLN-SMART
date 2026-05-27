import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
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
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { formatINR } from '../utils/currency';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { addToCart } = useCart();
  const { createToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  
  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]); // Increased max price
  const [sortBy, setSortBy] = useState('-createdAt');
  const [isOrganic, setIsOrganic] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, priceRange, sortBy, isOrganic, search]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let url = `/api/products?sort=${sortBy}`;
      if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
        url += `&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}`;
      }
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (isOrganic) url += `&isOrganic=true`;
      
      if (search) {
        // If there's a search term, we use the specific search API to leverage text indexing
        const searchRes = await axios.get(`/api/products/search?q=${encodeURIComponent(search)}`);
        
        // Filter the search results locally based on the other criteria
        let filtered = searchRes.data.data;
        if (selectedCategory) filtered = filtered.filter(p => p.category?._id === selectedCategory || p.category === selectedCategory);
        if (isOrganic) filtered = filtered.filter(p => p.isOrganic === true);
        if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
          filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        }
        
        // Sort locally
        filtered.sort((a, b) => {
          if (sortBy === 'price') return a.price - b.price;
          if (sortBy === '-price') return b.price - a.price;
          if (sortBy === '-rating') return b.rating - a.rating;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setProducts(filtered);
      } else {
        const res = await axios.get(url);
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res?.success) {
      createToast(`${product.name} added to cart!`);
    } else {
      createToast(res?.message || 'Failed to add to cart. Please login.', 'error');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-soft-white">
      {/* Header */}
      <div className="bg-forest py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold text-cream mb-4"
          >
            Organic Collection
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-cream/70 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of farm-fresh, 100% organic vegetables and fruits delivered straight to your doorstep.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-beige/50 sticky top-32">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-bold text-forest">Filters</h3>
                <button 
                  onClick={() => { setSelectedCategory(''); setPriceRange([0, 1000]); setIsOrganic(false); setSearch(''); }}
                  className="text-sm text-gold font-bold hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="relative mb-8">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 bg-soft-white border border-beige rounded-2xl focus:ring-2 focus:ring-gold outline-none text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-3 text-olive" size={18} />
              </form>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-bold text-forest mb-4 flex items-center">
                  Categories <ChevronDown size={16} className="ml-auto" />
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="flex items-center group cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      className="w-4 h-4 text-gold border-beige rounded-full focus:ring-gold"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                    />
                    <span className="ml-3 text-olive group-hover:text-forest transition-colors">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center group cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        className="w-4 h-4 text-gold border-beige rounded-full focus:ring-gold"
                        checked={selectedCategory === cat._id}
                        onChange={() => setSelectedCategory(cat._id)}
                      />
                      <span className="ml-3 text-olive group-hover:text-forest transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-bold text-forest mb-4">Max Price</h4>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="50"
                  className="w-full h-2 bg-beige rounded-lg appearance-none cursor-pointer accent-gold"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
                <div className="flex justify-between mt-2 text-sm text-olive font-medium">
                  <span>{formatINR(0)}</span>
                  <span>{formatINR(priceRange[1])}</span>
                </div>
              </div>

              {/* Organic Only */}
              <div className="mb-8">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isOrganic}
                      onChange={() => setIsOrganic(!isOrganic)}
                    />
                    <div className={`block w-12 h-7 rounded-full transition-colors ${isOrganic ? 'bg-gold' : 'bg-beige'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${isOrganic ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-forest font-bold text-sm">Organic Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-beige/50 flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
               <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 text-forest font-bold px-4 py-2 bg-soft-white rounded-xl"
                 >
                   <Filter size={18} /> <span>Filters</span>
                 </button>
                 <span className="text-olive font-medium">Showing <span className="text-forest font-bold">{products.length}</span> products</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white h-96 rounded-[2rem] animate-pulse border border-beige"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" 
                : "space-y-6"
              }>
                <AnimatePresence>
                  {products.map((product) => {
                    const isWishlisted = isInWishlist(product._id);
                    const isCompared = isInCompare(product._id);
                    return (
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
                            src={product.images[0]} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={product.name} 
                          />
                        </Link>
                        {product.discountPrice && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full pointer-events-none">
                            SALE
                          </div>
                        )}
                        {product.isOrganic && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg pointer-events-none">
                            <Leaf size={14} />
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 pointer-events-none">
                           <button 
                            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest hover:bg-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto shadow-lg"
                            title="Add to Cart"
                           >
                             <ShoppingCart size={18} />
                           </button>
                           <button 
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                            className={`w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 pointer-events-auto shadow-lg ${isWishlisted ? 'text-rose-500' : 'text-forest hover:bg-rose-500 hover:text-white'}`}
                            title="Wishlist"
                           >
                             <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                           </button>
                           <button 
                            onClick={(e) => { e.preventDefault(); toggleCompare(product); }}
                            className={`w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all transform translate-y-4 group-hover:translate-y-0 duration-700 pointer-events-auto shadow-lg ${isCompared ? 'text-blue-500' : 'text-forest hover:bg-blue-500 hover:text-white'}`}
                            title="Compare"
                           >
                             <Scale size={18} />
                           </button>
                        </div>
                      </div>

                      <div className="flex-grow w-full">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{product.categorySlug || 'Fresh'}</span>
                           <div className="flex items-center text-sm font-bold text-forest">
                             <Star size={14} className="text-gold fill-gold mr-1" /> {product.rating}
                           </div>
                        </div>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-xl font-serif font-bold text-forest mb-2 hover:text-gold transition-colors">{product.name}</h3>
                        </Link>
                        <p className={`text-olive text-sm mb-4 line-clamp-2 ${viewMode === 'list' ? 'block' : 'hidden'}`}>
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-serif font-bold text-forest">{formatINR(product.discountPrice || product.price)}</span>
                            {product.discountPrice && (
                              <span className="text-sm text-olive line-through font-medium">{formatINR(product.price)}</span>
                            )}
                            <span className="text-xs text-olive">/ {product.unit}</span>
                          </div>
                          {viewMode === 'list' && (
                            <button onClick={() => handleAddToCart(product)} className="btn-premium px-6 py-2 text-sm">Add to Cart</button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )})}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-beige/50">
                 <div className="w-20 h-20 bg-soft-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-olive" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold text-forest mb-2">No Products Found</h3>
                 <p className="text-olive">Try adjusting your filters or search terms.</p>
                 <button 
                  onClick={() => { setSelectedCategory(''); setPriceRange([0, 1000]); setIsOrganic(false); setSearch(''); }}
                  className="mt-6 text-gold font-bold hover:underline"
                 >
                   Clear All Filters
                 </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
