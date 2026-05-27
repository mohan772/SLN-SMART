import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Bell, 
  Settings, 
  User,
  ChevronRight,
  Clock,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { formatINR } from '../utils/currency';
import MyReviews from './MyReviews';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Order History');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: 'Order History', icon: ShoppingBag },
    { name: 'My Reviews', icon: MessageSquare },
    { name: 'My Addresses', icon: MapPin },
    { name: 'Wishlist', icon: Heart },
    { name: 'Notifications', icon: Bell },
    { name: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-soft-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-beige/50 text-center">
                 <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl overflow-hidden">
                    <User size={48} className="text-forest" />
                 </div>
                 <h2 className="text-xl font-serif font-bold text-forest mb-1">Alex Morgan</h2>
                 <p className="text-olive text-sm font-medium">Premium Member</p>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-beige/50 overflow-hidden">
                 {menuItems.map((item, i) => (
                   <button 
                    key={i}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center space-x-4 px-8 py-5 transition-all ${
                      activeTab === item.name ? 'bg-forest text-cream' : 'text-forest hover:bg-cream/50'
                    }`}
                   >
                      <item.icon size={20} />
                      <span className="font-bold">{item.name}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Main Panel */}
           <div className="lg:col-span-3">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-beige/50 min-h-[600px]">
                 
                 {activeTab === 'Order History' && (
                    <>
                       <div className="flex justify-between items-center mb-10">
                          <h2 className="text-3xl font-serif font-bold text-forest">Order History</h2>
                          <div className="flex space-x-2">
                             <span className="px-4 py-2 bg-soft-white rounded-xl text-xs font-bold text-forest">Recent</span>
                             <span className="px-4 py-2 text-xs font-bold text-olive">Archived</span>
                          </div>
                       </div>

                       {loading ? (
                          <div className="space-y-4">
                             {[1, 2, 3].map(n => <div key={n} className="h-32 bg-soft-white animate-pulse rounded-3xl"></div>)}
                          </div>
                       ) : orders.length > 0 ? (
                          <div className="space-y-6">
                             {orders.map((order) => (
                               <div key={order._id} className="p-6 bg-soft-white rounded-3xl border border-beige/30 hover:shadow-lg transition-all group cursor-pointer">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                     <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gold">
                                           <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                           <h4 className="font-bold text-forest">Order #{order._id.slice(-6).toUpperCase()}</h4>
                                           <p className="text-xs text-olive font-medium">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} Items</p>
                                        </div>
                                     </div>
                                     <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                           <p className="text-xs text-olive font-bold uppercase tracking-widest mb-1">Total Paid</p>
                                           <p className="text-xl font-serif font-bold text-forest">{formatINR(order.totalPrice)}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                                          order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-gold/10 text-gold'
                                        }`}>
                                           {order.status === 'Delivered' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                           <span>{order.status}</span>
                                        </div>
                                        <ChevronRight size={20} className="text-beige group-hover:text-gold transition-colors" />
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       ) : (
                          <div className="text-center py-24">
                             <div className="w-20 h-20 bg-soft-white rounded-full flex items-center justify-center mx-auto mb-6 text-beige">
                                <ShoppingBag size={32} />
                             </div>
                             <h3 className="text-xl font-serif font-bold text-forest mb-2">No orders yet</h3>
                             <p className="text-olive mb-8">Start your healthy journey with our fresh harvest.</p>
                             <button className="btn-premium px-8">Shop Now</button>
                          </div>
                       )}
                    </>
                 )}

                 {activeTab === 'My Reviews' && <MyReviews />}
                 
                 {activeTab !== 'Order History' && activeTab !== 'My Reviews' && (
                    <div className="text-center py-24">
                       <h3 className="text-xl font-serif font-bold text-forest mb-2">{activeTab} coming soon</h3>
                       <p className="text-olive">We are working on bringing this feature to you.</p>
                    </div>
                 )}

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
