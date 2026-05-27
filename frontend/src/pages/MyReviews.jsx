import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash2, MessageSquare, ShoppingBag } from 'lucide-react';
import { formatINR } from '../utils/currency';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/reviews/myreviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-forest">My Reviews</h2>
        <span className="px-4 py-2 bg-soft-white rounded-xl text-xs font-bold text-forest">
          {reviews.length} Total
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-soft-white rounded-3xl">
          <MessageSquare size={48} className="mx-auto text-beige mb-4" />
          <h3 className="text-xl font-bold text-forest">No reviews yet</h3>
          <p className="text-olive">Share your feedback on products you've purchased.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="p-6 bg-soft-white rounded-3xl border border-beige/30 flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={review.product?.images[0] || '/no-photo.jpg'} 
                  alt={review.product?.name} 
                  className="w-full h-full object-cover rounded-2xl shadow-sm" 
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-forest text-lg">{review.product?.name}</h4>
                    <div className="flex items-center space-x-1 mt-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "fill-gold text-gold" : "text-beige"} 
                        />
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteReview(review._id)}
                    className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="text-olive italic text-sm leading-relaxed bg-white/50 p-4 rounded-2xl border border-white">
                  "{review.comment}"
                </p>
                
                <p className="text-[10px] text-beige font-bold uppercase tracking-widest mt-4">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
