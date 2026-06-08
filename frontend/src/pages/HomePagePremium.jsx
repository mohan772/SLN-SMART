import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, Clock, Leaf, Zap, Truck, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PremiumProductCard from '../components/cards/PremiumProductCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    customers: '50K+',
    partners: '200+',
    products: '2K+',
    cities: '50+',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?sort=rating:desc&limit=12'),
      ]);

      setCategories(categoriesRes.data.data || []);
      setFeaturedProducts(productsRes.data.data || []);
      
      // Mock flash sales - products with discounts
      const flashSalesProducts = (productsRes.data.data || [])
        .filter((p) => p.discountPrice > 0)
        .slice(0, 5);
      setFlashSales(flashSalesProducts);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === product._id);

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: product.quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 overflow-hidden flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full"
              >
                <span className="text-emerald-300 text-sm font-semibold">
                  🌾 Fresh from Local Farms
                </span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Premium Groceries<br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Delivered Fresh
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                Experience the finest organic produce delivered to your doorstep in under 30 minutes. Direct from farms, zero middlemen, maximum freshness.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/shop')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Shop Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/10">
                {[
                  { label: 'Happy Customers', value: stats.customers },
                  { label: 'Farm Partners', value: stats.partners },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-6518221300f7?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh Groceries"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50"
        >
          <Clock className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Flash Sales */}
      {flashSales.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-8 h-8 text-red-500" />
                Flash Sales - 24 Hours Only
              </h2>
              <Link to="/shop" className="text-emerald-600 font-semibold hover:text-emerald-700">
                View All →
              </Link>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 4000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-8"
            >
              {flashSales.map((product) => (
                <SwiperSlide key={product._id}>
                  <PremiumProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Shop by Category</h2>
            <p className="text-slate-600 text-lg">Curated collections for every need</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition"
                onClick={() => navigate(`/shop/category/${cat.slug || cat.name.toLowerCase()}`)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                    <p className="text-slate-300 text-sm">
                      {cat.productCount || Math.floor(Math.random() * 50 + 10)} items
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trending Products</h2>
            <p className="text-slate-600 text-lg">Most loved by our customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <PremiumProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="px-12 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: '30 Min Delivery',
                desc: 'Lightning-fast delivery right to your doorstep',
              },
              {
                icon: Leaf,
                title: '100% Organic',
                desc: 'Certified organic produce from trusted farms',
              },
              {
                icon: Truck,
                title: 'Free Delivery',
                desc: 'Free shipping on orders above ₹500',
              },
              {
                icon: Star,
                title: 'Quality Guaranteed',
                desc: 'Fresh produce or money back guarantee',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 text-center hover:shadow-lg transition"
              >
                <feature.icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Fresh?</h2>
          <p className="text-xl mb-8 opacity-90">
            Download our app or start shopping online now
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="px-12 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-slate-100 transition inline-flex items-center gap-2"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
