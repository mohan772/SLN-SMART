import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { formatINR } from '../../utils/currency'
import { useWishlist } from '../../context/WishlistContext'
import { useCompare } from '../../context/CompareContext'
import { Scale } from 'lucide-react'

const ProductCard = ({ product, onAddToCart }) => {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { toggleCompare, isInCompare } = useCompare()

  const inStock = product.stock > 0
  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const isWishlisted = isInWishlist(product._id)
  const isCompared = isInCompare(product._id)

  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="card-premium group h-full flex flex-col relative"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          />
        </Link>
        
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="badge-premium bg-forest text-white">
              Featured
            </span>
          )}
          {product.isOrganic && (
            <span className="badge-premium bg-emerald-600 text-white">
              Organic
            </span>
          )}
          {hasDiscount && (
            <span className="badge-premium bg-gold text-forest">
              Sale
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button 
            onClick={() => toggleWishlist(product)}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
          >
            <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => toggleCompare(product)}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${isCompared ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}
            title="Compare"
          >
            <Scale size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            {product.categorySlug || 'Fresh'}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <FiStar className="fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`} className="group-hover:text-forest transition-colors">
          <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="mb-4 text-sm text-slate-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.price)}
                </span>
                <span className="text-lg font-bold text-forest">
                  {formatINR(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-forest">
                {formatINR(product.price)}
              </span>
            )}
            <span className="text-[10px] font-medium text-slate-400">per {product.unit}</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className="btn-premium !px-4 !py-2 !text-sm flex items-center gap-2"
          >
            <FiShoppingCart className="h-4 w-4" />
            <span>{inStock ? 'Add' : 'Out'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard

