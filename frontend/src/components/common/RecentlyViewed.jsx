import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../cards/ProductCard';
import { Clock } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const RecentlyViewed = ({ currentProductId }) => {
  const [recent, setRecent] = useState([]);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { createToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentlyViewed();
    }
  }, [isAuthenticated, currentProductId]);

  const fetchRecentlyViewed = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/recently-viewed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out the current product if on a product page
      const filtered = res.data.data.filter(p => p._id !== currentProductId);
      setRecent(filtered);
    } catch (err) {
      console.error('Failed to fetch recently viewed:', err);
    }
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res?.success) {
      createToast(`${product.name} added to cart!`);
    } else {
      createToast(res?.message || 'Failed to add to cart', 'error');
    }
  };

  if (!isAuthenticated || recent.length === 0) return null;

  return (
    <div className="py-12 border-t border-beige bg-soft-white">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center">
            <Clock size={20} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-forest">Recently Viewed</h2>
        </div>

        <Swiper
          slidesPerView={1.2}
          spaceBetween={20}
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
          }}
          className="pb-12"
        >
          {recent.map((product) => (
            <SwiperSlide key={product._id} className="h-auto">
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RecentlyViewed;
