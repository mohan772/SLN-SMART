import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiGrid, FiList, FiSearch } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import api from '../services/api'
import ProductCard from '../components/cards/ProductCard'
import { useAuth } from '../context/AuthContext'
import SectionTitle from '../components/common/SectionTitle'

const sortOptions = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Top-rated', value: '-rating' },
]

const Shop = () => {
  const { addToCart } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('-createdAt')
  const [listView, setListView] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = {
          page,
          limit: 12,
          sort,
          search,
        }
        if (activeCategory !== 'all') {
          params.category = activeCategory
        }
        const [productRes, categoryRes] = await Promise.all([
          api.get('/products', { params }),
          api.get('/categories'),
        ])

        setProducts(productRes.data.data)
        setTotalPages(productRes.data.totalPages || 1)
        setCategories(categoryRes.data.data)
      } catch (err) {
        setError('Unable to load products. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, sort, search, activeCategory])

  const filteredCategories = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...categories.map((item) => ({ label: item.name, value: item._id })),
    ],
    [categories]
  )

  return (
    <div className="space-y-10">
      <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        <SectionTitle eyebrow="Shop" title="Market essentials and premium harvests" description="Browse premium vegetables with elegant filtering, list view, and fast cart actions." />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] bg-slate-50 p-6">
            <label className="block text-sm font-medium text-slate-700">Search</label>
            <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <FiSearch className="h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fresh produce"
                className="w-full border-none bg-transparent text-slate-900 outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] bg-slate-50 p-6">
              <label className="block text-sm font-medium text-slate-700">Sort by</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6">
              <label className="block text-sm font-medium text-slate-700">Display</label>
              <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-2">
                <button onClick={() => setListView(false)} className={`h-11 flex-1 rounded-2xl text-sm font-medium transition ${!listView ? 'bg-emerald-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <FiGrid className="mx-auto" /> Grid
                </button>
                <button onClick={() => setListView(true)} className={`h-11 flex-1 rounded-2xl text-sm font-medium transition ${listView ? 'bg-emerald-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <FiList className="mx-auto" /> List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_3fr]">
        <aside className="space-y-4 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Category</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {filteredCategories.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setActiveCategory(item.value)
                      setPage(1)
                    }}
                    className={`rounded-full px-4 py-2 text-sm transition ${activeCategory === item.value ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Availability</p>
              <div className="mt-3 grid gap-3">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input type="checkbox" disabled className="h-4 w-4 rounded border-slate-300 bg-white" />
                  <span className="text-sm text-slate-600">Only in-stock</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input type="checkbox" disabled className="h-4 w-4 rounded border-slate-300 bg-white" />
                  <span className="text-sm text-slate-600">Organic options only</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          {loading ? (
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">Loading products...</div>
          ) : error ? (
            <div className="rounded-[2.5rem] border border-red-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">{error}</div>
          ) : (
            <div className={`grid gap-6 ${listView ? 'grid-cols-1' : 'lg:grid-cols-2 xl:grid-cols-3'}`}>
              {products.map((product) => (
                <motion.div key={product._id} whileHover={{ y: 6 }}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-700">
            <p>{products.length} results found</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setPage(Math.max(page - 1, 1))} className="rounded-full bg-white px-4 py-2 shadow-sm hover:bg-slate-100">
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(page + 1, totalPages))} className="rounded-full bg-white px-4 py-2 shadow-sm hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        </main>
      </section>
    </div>
  )
}

export default Shop
