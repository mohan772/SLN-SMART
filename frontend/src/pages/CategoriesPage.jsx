import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 min-h-screen bg-soft-white">
      {/* Header */}
      <div className="bg-forest py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-serif font-bold text-cream mb-6"
          >
            Our Collections
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-cream/70 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our diverse range of farm-fresh categories. From organic leafy greens to exotic tropical fruits, we have everything you need for a healthy lifestyle.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-beige rounded-2xl focus:ring-2 focus:ring-gold outline-none text-forest shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-olive" size={20} />
          </div>
          <div className="flex items-center space-x-2 text-olive font-medium">
            <span className="text-forest font-bold">{filteredCategories.length}</span> Categories Found
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white h-96 rounded-[2.5rem] animate-pulse border border-beige"></div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCategories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/shop/category/${cat.slug || slugify(cat.name)}`}>
                  <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-[450px] shadow-lg border border-beige/50 hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={cat.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
                      <h3 className="text-3xl font-serif font-bold text-cream mb-2">{cat.name}</h3>
                      <p className="text-gold font-medium text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {cat.description || 'Premium farm-fresh picks delivered to your doorstep.'}
                      </p>
                      <div className="flex items-center text-cream font-bold group-hover:text-gold transition-colors">
                        Browse Products <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-beige/50">
             <div className="w-24 h-24 bg-soft-white rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={40} className="text-olive" />
             </div>
             <h3 className="text-3xl font-serif font-bold text-forest mb-4">No Categories Found</h3>
             <p className="text-olive text-lg">We couldn't find any categories matching your search.</p>
             <button 
              onClick={() => setSearch('')}
              className="mt-8 text-gold font-bold text-lg hover:underline"
             >
               View All Collections
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
