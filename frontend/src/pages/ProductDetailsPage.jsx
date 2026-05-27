import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Leaf,
  Plus,
  Minus,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import RecentlyViewed from '../components/common/RecentlyViewed';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    if (isAuthenticated) {
      recordView();
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/recently-viewed', { productId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to record view:', err);
    }
  };

  const handleAddToCart = async () => {
    const res = await addToCart(product._id, quantity);
    if (res.success) {
      // Show success toast or just stay
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-soft-white"><div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="pt-32 text-center h-screen text-2xl font-serif font-bold text-forest">Product not found</div>;

  const isWishlisted = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  return (
    <div className="pt-32 pb-24 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-[3rem] overflow-hidden border border-beige shadow-xl h-[600px]"
             >
                <img src={product.images[selectedImage]} className="w-full h-full object-cover" alt={product.name} />
             </motion.div>
             <div className="flex space-x-4">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-gold shadow-lg scale-105' : 'border-beige opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
             </div>
          </div>

          {/* Details Side */}
          <div className="lg:w-1/2">
             <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-gold/20">
                  {product.categorySlug || 'Fresh'}
                </span>
                {product.isOrganic && (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                    <Leaf size={12} /> <span>100% Organic</span>
                  </span>
                )}
             </div>

             <h1 className="text-5xl md:text-6xl font-serif font-bold text-forest mb-6 leading-tight">{product.name}</h1>
             
             <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center text-forest font-bold">
                   <div className="flex space-x-1 mr-2">
                     {[1, 2, 3, 4, 5].map((s) => (
                       <Star key={s} size={16} className={`${s <= Math.round(product.rating) ? 'text-gold fill-gold' : 'text-beige'}`} />
                     ))}
                   </div>
                   <span>({product.numReviews} Reviews)</span>
                </div>
                <div className="h-4 w-px bg-beige"></div>
                <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                   {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
             </div>

             <div className="flex items-baseline space-x-4 mb-10">
                <span className="text-5xl font-serif font-bold text-forest">{formatINR(product.discountPrice || product.price)}</span>
                {product.discountPrice && (
                  <span className="text-2xl text-olive line-through font-medium">{formatINR(product.price)}</span>
                )}
                <span className="text-xl text-olive">/ {product.unit}</span>
             </div>

             <p className="text-lg text-olive leading-relaxed mb-10 max-w-xl">
                {product.description}
             </p>

             {/* Quantity & Actions */}
             <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                <div className="flex items-center bg-white rounded-2xl p-2 border border-beige shadow-sm">
                   <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-forest hover:bg-soft-white rounded-xl transition-all"
                   >
                     <Minus size={20} />
                   </button>
                   <span className="w-16 text-center text-2xl font-serif font-bold text-forest">{quantity}</span>
                   <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 flex items-center justify-center text-forest hover:bg-soft-white rounded-xl transition-all"
                   >
                     <Plus size={20} />
                   </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="btn-premium flex-grow py-5 text-lg flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   <ShoppingCart size={22} />
                   <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                   {product.stock > 0 && <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />}
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={`w-16 h-16 border-2 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isWishlisted ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-beige text-forest hover:bg-white hover:border-rose-500 hover:text-rose-500'}`}
                    title="Wishlist"
                  >
                     <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                  </button>
                  <button 
                    onClick={() => toggleCompare(product)}
                    className={`w-16 h-16 border-2 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isCompared ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-beige text-forest hover:bg-white hover:border-blue-500 hover:text-blue-500'}`}
                    title="Compare"
                  >
                     <Scale size={24} />
                  </button>
                </div>
             </div>

             {/* Features Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                <div className="p-5 bg-white rounded-2xl border border-beige/50 flex items-start space-x-4">
                   <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-forest">
                      <Truck size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-forest text-sm">Free Delivery</h4>
                      <p className="text-xs text-olive">On orders over $50</p>
                   </div>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-beige/50 flex items-start space-x-4">
                   <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-forest">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-forest text-sm">Certified Quality</h4>
                      <p className="text-xs text-olive">100% farm fresh check</p>
                   </div>
                </div>
             </div>

             {/* More Info Tabs */}
             <div className="border-t border-beige pt-12">
                <div className="flex space-x-12 mb-8 border-b border-beige">
                   <button className="pb-4 border-b-2 border-emerald-900 font-bold text-forest">Nutritional Info</button>
                   <button className="pb-4 border-b-2 border-transparent font-bold text-olive hover:text-forest transition-all">Farmer Details</button>
                   <button className="pb-4 border-b-2 border-transparent font-bold text-olive hover:text-forest transition-all">Reviews</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                   {Object.entries(product.nutritionalInfo || {}).map(([key, value], i) => (
                     <div key={i}>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">{key}</h5>
                        <p className="font-serif font-bold text-forest text-lg">{Array.isArray(value) ? value.join(', ') : value}</p>
                     </div>
                   ))}
                </div>
             </div>

          </div>
        </div>
      </div>
      <RecentlyViewed currentProductId={product._id} />
    </div>
  );
};

export default ProductDetailsPage;
