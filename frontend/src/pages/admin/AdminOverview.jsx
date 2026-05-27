import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, DollarSign, Box, Star, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { formatINR } from '../../utils/currency';

const AdminOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [inventoryAnalytics, setInventoryAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [analyticsRes, invRes, ordersRes] = await Promise.all([
        axios.get('/api/orders/analytics', config),
        axios.get('/api/inventory/analytics', config),
        axios.get('/api/orders', config)
      ]);

      setAnalytics(analyticsRes.data.data);
      setInventoryAnalytics(invRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics || !inventoryAnalytics) {
    return <div className="p-8 text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div>
         <h1 className="text-4xl font-serif font-bold text-forest-900 mb-2">Dashboard Overview</h1>
         <p className="text-slate-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Total Revenue', value: formatINR(analytics.totalRevenue), trend: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
           { label: 'Total Orders', value: analytics.totalOrders, trend: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
           { label: 'Total Products', value: inventoryAnalytics.totalProducts, trend: 'Active', icon: Box, color: 'text-purple-600', bg: 'bg-purple-100' },
           { label: 'Low Stock Items', value: inventoryAnalytics.lowStockCount, trend: 'Action Needed', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-100' }
         ].map((stat, i) => (
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
           >
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                   <stat.icon size={28} />
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                   {stat.trend}
                 </span>
              </div>
              <p className="text-slate-500 font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{stat.value}</h3>
           </motion.div>
         ))}
      </div>

      {/* Charts & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-serif font-bold text-slate-900">Sales Overview</h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.salesByMonth}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F3D2E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0F3D2E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#0F3D2E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-forest-900 p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-serif font-bold mb-8 text-gold">Stock Alerts</h3>
              <div className="space-y-6">
                 {inventoryAnalytics.lowStockProducts.slice(0, 4).map((p, i) => (
                   <div key={i} className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                         <Clock size={20} />
                      </div>
                      <div className="min-w-0">
                         <h4 className="font-bold text-sm truncate">{p.name}</h4>
                         <p className="text-xs text-cream/70">Only {p.stock} left</p>
                      </div>
                   </div>
                 ))}
                 {inventoryAnalytics.lowStockProducts.length === 0 && (
                   <div className="text-center py-12">
                      <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4 opacity-80" />
                      <p className="text-cream/80 font-medium">All products are well stocked!</p>
                   </div>
                 )}
              </div>
            </div>
         </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-serif font-bold text-slate-900">Recent Orders</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm font-bold border-b border-slate-200 uppercase tracking-wider">
                  <th className="pb-6 px-4">Order ID</th>
                  <th className="pb-6 px-4">Customer</th>
                  <th className="pb-6 px-4">Status</th>
                  <th className="pb-6 px-4">Total</th>
                  <th className="pb-6 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50 transition-all">
                    <td className="py-6 px-4 font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-6 px-4">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                           {order.user?.name.charAt(0)}
                         </div>
                         <span className="font-medium text-slate-700">{order.user?.name}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 px-4 font-bold text-slate-900">{formatINR(order.totalPrice)}</td>
                    <td className="py-6 px-4 text-slate-500 text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminOverview;
