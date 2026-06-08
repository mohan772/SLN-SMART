import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import api from '../services/api'
import SectionTitle from '../components/common/SectionTitle'
import ProductCard from '../components/cards/ProductCard'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/currency'
import { FiArrowRight, FiShield, FiTruck, FiZap } from 'react-icons/fi'

const categoryTiles = [
  { name: 'Fruits', description: 'Nature\'s sweet harvest', icon: '🍓', color: 'bg-rose-50' },
  { name: 'Vegetables', description: 'Crisp garden fresh', icon: '🥬', color: 'bg-emerald-50' },
  { name: 'Organic', description: 'Certified mindful living', icon: '🌿', color: 'bg-green-50' },
  { name: 'Exotic', description: 'Rare global flavors', icon: '🥭', color: 'bg-amber-50' },
  { name: 'Dry Fruits', description: 'Premium energy snack', icon: '🥜', color: 'bg-orange-50' },
]

const features = [
  { icon: <FiTruck />, title: 'Flash Delivery', desc: 'From farm to your door in under 2 hours.' },
  { icon: <FiShield />, title: 'Verified Quality', desc: 'Each item is hand-inspected for perfection.' },
  { icon: <FiZap />, title: 'Daily Harvest', desc: 'Freshness picked every single morning.' },
]

const heroVariants = {
  fadeIn: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 32 },
}

const Home = () => {
  const { addToCart } = useAuth()
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true)
      try {
        const [featuredRes, trendingRes, categoriesRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?trending=true&limit=8'),
          api.get('/categories'),
        ])

        const featuredItems = featuredRes.data.data || []
        const trendingItems = trendingRes.data.data || []
        const categoryItems = categoriesRes.data.data || []

        if (featuredItems.length === 0) {
          const backup = await api.get('/products?sort=rating:desc&limit=8')
          setFeatured(backup.data.data || [])
        } else {
          setFeatured(featuredItems)
        }

        if (trendingItems.length === 0) {
          const backup = await api.get('/products?sort=rating:desc&limit=8')
          setTrending(backup.data.data || [])
        } else {
          setTrending(trendingItems)
        }

        setCategories(categoryItems)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadHomeData()
  }, [])

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-forest px-6 py-24 text-white sm:px-12 lg:px-20 lg:py-32">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl">
          <motion.div 
            initial="hidden" 
            animate="fadeIn" 
            variants={heroVariants} 
            transition={{ duration: 0.8 }} 
            className="max-w-3xl space-y-8"
          >
            <span className="badge-premium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              The Gold Standard in Freshness
            </span>
            <h1 className="text-6xl font-bold leading-tight sm:text-7xl">
              Farm Fresh Produce, <span className="text-emerald-400">Luxury</span> Experience.
            </h1>
            <p className="max-w-xl text-xl text-cream/80">
              Discover a curated selection of premium organic vegetables and fruits, harvested at peak ripeness and delivered with uncompromising care.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop" className="btn-premium flex items-center gap-2 group">
                Shop Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-forest">
                Join the Club
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container-custom">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-xl">
                {f.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container-custom space-y-10">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Curated Collections"
            title="Harvested for Every Kitchen"
          />
          <Link to="/shop" className="text-forest font-bold flex items-center gap-2 hover:underline">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categoryTiles.map((item) => (
            <motion.article
              key={item.name}
              whileHover={{ y: -8 }}
              className={`rounded-3xl p-8 shadow-sm transition-all border border-slate-100 ${item.color} group cursor-pointer`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                <FiArrowRight />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom space-y-10">
        <SectionTitle
          eyebrow="Premium Picks"
          title="Best of the Season"
          description="Hand-selected daily for their exceptional quality and flavor profile."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Trending / Best Sellers */}
      <section className="container-custom space-y-10">
        <SectionTitle
          eyebrow="Market Favorites"
          title="Trending this Week"
        />
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-2">
          <Swiper 
            modules={[Navigation, Autoplay, Pagination]} 
            spaceBetween={24} 
            slidesPerView={1} 
            navigation 
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }} 
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
            className="!p-6"
          >
            {trending.map((product) => (
              <SwiperSlide key={product._id} className="pb-12">
                <ProductCard product={product} onAddToCart={addToCart} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-24">
        <div className="container-custom space-y-16">
          <div className="text-center space-y-4">
            <span className="badge-premium bg-forest text-emerald-400">Testimonials</span>
            <h2 className="text-4xl font-bold text-white">What Our Community is Saying</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { name: 'Maya Patel', role: 'Wellness Coach', text: 'The quality of produce is unmatched. Every delivery feels like a luxury gift from nature.' },
              { name: 'Elliot James', role: 'Executive Chef', text: 'Consistency is key in my kitchen. SLN never fails to deliver the highest grade ingredients.' },
              { name: 'Priya Singh', role: 'Busy Parent', text: 'Finally, a grocery service that cares about health as much as I do. The organic range is superb.' },
            ].map((review, i) => (
              <motion.article 
                key={i} 
                whileHover={{ y: -10 }} 
                className="rounded-3xl bg-slate-800/50 p-8 border border-slate-700/50 backdrop-blur-sm"
              >
                <div className="flex gap-1 text-gold mb-6">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" />)}
                </div>
                <p className="text-lg text-slate-300 italic mb-8">“{review.text}”</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-700" />
                  <div>
                    <p className="font-bold text-white">{review.name}</p>
                    <p className="text-sm text-slate-500">{review.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom">
        <div className="rounded-[3rem] bg-forest-light py-20 px-10 text-center space-y-8">
          <h2 className="text-5xl font-bold text-white">Ready to elevate your kitchen?</h2>
          <p className="text-xl text-emerald-50/80 max-w-2xl mx-auto">
            Join 12,000+ health-conscious families who trust SLN for their daily nutrition.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/shop" className="btn-premium !bg-gold !text-forest hover:!bg-gold-light">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

export default Home
