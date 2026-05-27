import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiHeart, FiTruck, FiUser } from 'react-icons/fi'
import api from '../services/api'
import SectionTitle from '../components/common/SectionTitle'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/currency'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useAuth()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/products/${id}`)
        setProduct(response.data.data)
      } catch (err) {
        setError('Unable to load product details.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return <div className="text-center py-24 text-slate-600">Loading product details...</div>
  }

  if (error || !product) {
    return <div className="text-center py-24 text-rose-600">{error || 'Product not available.'}</div>
  }

  const nutrients = [
    { label: 'Vitamin C', value: '34mg' },
    { label: 'Fiber', value: '4.2g' },
    { label: 'Protein', value: '2.1g' },
    { label: 'Calories', value: '47 kcal' },
  ]

  return (
    <div className="space-y-12 px-6 py-10 sm:px-8 lg:px-12">
      <SectionTitle eyebrow="Product story" title={product.name} description={product.description || 'A premium vegetable selection sourced from trusted farms and delivered fresh.'} />

      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
            <img src={product.image || 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=60'} alt={product.name} className="h-full w-full rounded-[2rem] object-cover" />
            <div className="space-y-5">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Farmer details</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{product.farmName || 'Sunrise Organic Farm'}</p>
                <p className="mt-2 text-slate-600">{product.farmDescription || 'Sourced from family-run farms using regenerative practices and professional cold-chain logistics.'}</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 text-slate-700">
                  <FiClock className="h-5 w-5" />
                  <span>Delivery estimate: 24-36 hours</span>
                </div>
                <div className="mt-4 flex items-center gap-3 text-slate-700">
                  <FiTruck className="h-5 w-5" />
                  <span>Free delivery on all orders above {formatINR(65)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">{formatINR(product.price)}</span>
                <span className="text-sm font-semibold text-slate-900">{product.category}</span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
                <FiHeart className="h-5 w-5 text-rose-500" />
                <span>{product.reviewCount || 28} reviews • {product.rating?.toFixed(1) || 4.7} / 5</span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">-</button>
                <span className="min-w-[3rem] text-center text-lg font-semibold text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">+</button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => addToCart(product, quantity)} className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800">
                  Add to Cart
                </button>
                <Link to="/checkout" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300">
                  Buy Now
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Nutritional highlights</p>
              <div className="mt-5 space-y-3">
                {nutrients.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.75rem] bg-white p-5 text-slate-600">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Farmer note</p>
                <p className="mt-3 text-sm">{product.farmerNote || 'Harvested at peak maturity and stored under controlled conditions to preserve freshness and texture.'}</p>
              </div>
            </div>
          </div>

          {product.reviews?.length ? (
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Customer reviews</h3>
              <div className="mt-6 space-y-4">
                {product.reviews.slice(0, 3).map((review) => (
                  <div key={review._id} className="rounded-[1.75rem] bg-white p-5 shadow-sm">
                    <p className="font-semibold text-slate-900">{review.user?.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Rated {review.rating} / 5</p>
                    <p className="mt-3 text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>

        <aside className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Delivery summary</p>
            <div className="mt-4 space-y-3 text-slate-600">
              <p>Live tracking updates, eco-friendly packaging, and white glove fulfillment for every order.</p>
              <div className="rounded-3xl bg-emerald-900/5 p-4 text-sm text-emerald-900">ETA 24-36 hours • Free delivery over {formatINR(65)}</div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Farmer profile</p>
            <div className="mt-4 flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-900/10 text-emerald-900">🌾</span>
              <div>
                <p className="font-semibold text-slate-900">Neel Patel</p>
                <p className="mt-1 text-sm text-slate-600">Organic grower from Jaipur, focusing on nutrient-rich seasonal harvests.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProductDetails
