import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Leaf, Truck, Star, Clock, ShieldCheck } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatINR } from '../utils/currency';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data.data);
      } catch (err) {
        console.error('Failed to load site stats:', err);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const res = await api.get('/products?sort=-rating&limit=6');
        if (res.data && res.data.data) {
           setFeaturedProducts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
    };
    
    loadFeaturedProducts();
  }, []);

  return (
    <div className="bg-soft-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-forest">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-cream"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-bold text-sm tracking-wider uppercase mb-6 border border-gold/30"
            >
              100% Organic & Farm Fresh
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8">
              Nature's Best, <br />
              <span className="text-gold italic">Delivered Smart.</span>
            </h1>
            <p className="text-xl text-cream/80 mb-10 max-w-lg leading-relaxed">
              Experience the luxury of premium organic groceries sourced directly from local farmers. Pure, fresh, and exceptionally healthy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/shop" className="btn-premium py-4 px-10 text-lg flex items-center justify-center group">
                Shop Collection <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/#about" className="btn-outline border-cream text-cream py-4 px-10 text-lg flex items-center justify-center hover:bg-cream hover:text-forest">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Cards (Desktop only) */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/3 pr-8 space-y-6">
          {[
            { name: 'Organic Kale', price: 360, img: 'https://images.unsplash.com/photo-1524179524541-1bb3ca87865c?auto=format&fit=crop&q=80' },
            { name: 'Wild Berries', price: 650, img: 'https://images.unsplash.com/photo-1464960144455-90f774304919?auto=format&fit=crop&q=80' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.2), duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex items-center space-x-4 hover:bg-white/20 transition-all cursor-pointer group"
            >
              <img src={item.img} className="w-16 h-16 rounded-2xl object-cover" alt="" />
              <div>
                <h4 className="text-cream font-bold">{item.name}</h4>
                <p className="text-gold font-serif">{formatINR(item.price)}</p>
              </div>
              <div className="ml-auto w-8 h-8 rounded-full bg-gold text-forest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ArrowRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-20 -mt-10 shadow-xl max-w-6xl mx-auto rounded-3xl border border-beige/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {([
            { label: 'Happy Customers', value: stats ? `${stats.happyCustomers}` : '15k+', icon: ShieldCheck },
            { label: 'Farm Partners', value: stats ? `${stats.farmPartners}` : '120+', icon: Leaf },
            { label: 'Cities Covered', value: stats ? `${stats.citiesCovered}` : '25+', icon: Truck },
            { label: 'Fast Delivery', value: stats ? stats.averageDeliveryTime : '45min', icon: Zap }
          ]).map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-forest group-hover:text-cream transition-all duration-300">
                <stat.icon size={24} className="text-forest group-hover:text-cream" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-forest">{stat.value}</h3>
              <p className="text-olive font-medium text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Categories</span>
            <h2 className="text-5xl font-serif font-bold text-forest leading-tight">
              Curated Selection of <br />Farm Fresh Goodness
            </h2>
          </div>
          <Link to="/shop" className="group flex items-center text-forest font-bold text-lg mt-6 md:mt-0">
            View All Categories <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <Link key={i} to={`/shop/category/${cat.slug || slugify(cat.name)}`}>
              <motion.div
                whileHover={{ y: -15 }}
                className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-[450px]"
              >
                <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <p className="text-gold font-bold text-sm mb-2 line-clamp-2">{cat.description || 'Fresh farm picks'}</p>
                  <h3 className="text-2xl font-serif font-bold text-cream mb-4">{cat.name}</h3>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="text-cream" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-24 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Trending</span>
            <h2 className="text-5xl font-serif font-bold text-forest">Best Sellers</h2>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-16"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="card-premium p-4 group">
                  <div className="relative overflow-hidden rounded-2xl mb-6 h-64 bg-soft-white">
                    <Link to={`/product/${product._id}`}>
                      <img src={product.images?.[0] || '/no-photo.jpg'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
                    </Link>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-forest text-sm font-bold flex items-center pointer-events-none">
                      <Star size={14} className="text-gold mr-1 fill-gold" /> {product.rating}
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-olive text-sm mb-1 uppercase tracking-widest font-bold text-[10px] text-gold">{product.category?.name || 'Fresh'}</p>
                    <Link to={`/product/${product._id}`}>
                      <h4 className="text-xl font-serif font-bold text-forest mb-4 hover:text-gold transition-colors">{product.name}</h4>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-serif font-bold text-forest">{formatINR(product.price)}</p>
                      <Link to={`/product/${product._id}`} className="w-12 h-12 bg-forest text-cream rounded-xl flex items-center justify-center hover:bg-olive transition-all">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-soft-white border-y border-beige/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Kind Words</span>
                <h2 className="text-5xl font-serif font-bold text-forest mb-8 leading-tight">
                  What our premium <br />customers say
                </h2>
                <div className="space-y-8">
                   <div className="p-8 bg-white rounded-3xl shadow-sm border border-beige/30">
                      <div className="flex space-x-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} className="text-gold fill-gold" />)}
                      </div>
                      <p className="text-lg italic text-forest mb-6">
                        "The quality of the leafy greens is incomparable. It's like having a farm in my own backyard. The delivery is always on time and the packaging is eco-friendly."
                      </p>
                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 rounded-full bg-beige overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" alt="" />
                         </div>
                         <div>
                            <h4 className="font-bold text-forest">Sarah Jenkins</h4>
                            <p className="text-olive text-sm font-medium">Verified Customer</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              <div className="relative">
                 <div className="rounded-[3rem] overflow-hidden h-[600px] w-full shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1541013227652-3a8120e2311b?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="absolute -bottom-10 -left-10 bg-forest p-10 rounded-3xl shadow-2xl max-w-xs text-cream">
                    <p className="text-4xl font-serif font-bold mb-2">98%</p>
                    <p className="text-cream/70">Of our customers recommend our fresh daily farm picks.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest pt-24 pb-12 text-cream">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                  <span className="text-forest font-serif text-2xl font-bold">S</span>
                </div>
                <span className="text-3xl font-serif font-bold">
                  SLN <span className="text-gold">Smart</span>
                </span>
              </div>
              <p className="text-cream/60 max-w-md text-lg leading-relaxed mb-8">
                Pioneering the future of organic groceries. We bridge the gap between pure nature and your smart modern lifestyle.
              </p>
              <div className="flex space-x-4">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-forest hover:border-gold transition-all cursor-pointer">
                     <Star size={20} />
                   </div>
                 ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-serif font-bold mb-8 text-gold">Quick Links</h4>
              <ul className="space-y-4 opacity-70">
                <li><Link to="/shop" className="hover:text-gold transition-all">Shop All Products</Link></li>
                <li><Link to="/#categories" className="hover:text-gold transition-all">Categories</Link></li>
                <li><Link to="/#about" className="hover:text-gold transition-all">Our Story</Link></li>
                <li><Link to="/#faq" className="hover:text-gold transition-all">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-serif font-bold mb-8 text-gold">Contact Us</h4>
              <ul className="space-y-4 opacity-70">
                <li>info@slnsmart.shop</li>
                <li>+1 (555) 123-4567</li>
                <li>Organic Valley, CA 90210</li>
              </ul>
            </div>
         </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/10 text-center opacity-40 text-sm">
          <p>&copy; 2026 SLN Produce Co. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
