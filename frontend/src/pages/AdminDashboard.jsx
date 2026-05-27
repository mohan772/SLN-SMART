import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Box,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import { formatINR } from '../utils/currency';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
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
      
      const [analyticsRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/orders/analytics', config),
        axios.get('/api/products', config),
        axios.get('/api/orders', config)
      ]);

      setAnalytics(analyticsRes.data.data);
      setProducts(productsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-forest p-8 flex flex-col fixed h-full z-20">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
            <span className="text-forest font-serif text-2xl font-bold">S</span>
          </div>
          <span className="text-2xl font-serif font-bold text-cream">SLN <span className="text-gold">Admin</span></span>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gold text-forest shadow-lg' 
                  : 'text-cream/60 hover:bg-white/10 hover:text-cream'
              }`}
            >
              <item.icon size={22} />
              <span className="font-bold">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-white/5 rounded-3xl border border-white/10">
           <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <TrendingUp size={20} />
              </div>
              <p className="text-sm font-bold text-cream">Premium Plan</p>
           </div>
           <button className="w-full py-3 bg-cream text-forest rounded-xl text-sm font-bold hover:bg-gold transition-colors">
              Upgrade System
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72 p-12">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-12">
           <div>
             <h1 className="text-4xl font-serif font-bold text-forest mb-2">Welcome Back, Admin</h1>
             <p className="text-olive">Here's what's happening with your store today.</p>
           </div>
           <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search anything..."
                  className="pl-12 pr-6 py-3 bg-white border border-beige rounded-2xl w-64 focus:ring-2 focus:ring-gold outline-none"
                />
                <Search className="absolute left-4 top-3.5 text-olive" size={20} />
              </div>
              <button className="w-12 h-12 bg-white border border-beige rounded-2xl flex items-center justify-center text-forest hover:bg-beige transition-all">
                <Plus size={24} />
              </button>
           </div>
        </header>

        {activeTab === 'dashboard' && analytics && (
          <div className="space-y-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { label: 'Total Revenue', value: formatINR(analytics.totalRevenue), trend: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
                 { label: 'Total Orders', value: analytics.totalOrders, trend: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
                 { label: 'Total Products', value: analytics.totalProducts, trend: 'Active', icon: Box, color: 'text-purple-600', bg: 'bg-purple-100' },
                 { label: 'Avg. Rating', value: '4.9', trend: '+0.2', icon: Star, color: 'text-gold', bg: 'bg-gold/10' }
               ].map((stat, i) => (
                 <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-beige/50"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                         <stat.icon size={28} />
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-beige text-forest'}`}>
                         {stat.trend}
                       </span>
                    </div>
                    <p className="text-olive font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-serif font-bold text-forest">{stat.value}</h3>
                 </motion.div>
               ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-beige/50">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-serif font-bold text-forest">Sales Overview</h3>
                    <div className="flex space-x-2">
                       <button className="px-4 py-2 bg-forest text-cream rounded-xl text-xs font-bold">Monthly</button>
                       <button className="px-4 py-2 bg-soft-white text-forest rounded-xl text-xs font-bold">Weekly</button>
                    </div>
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

               <div className="bg-forest p-10 rounded-[2.5rem] text-cream shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-serif font-bold mb-8">Stock Alerts</h3>
                    <div className="space-y-6">
                       {products.filter(p => p.stock < 10).map((p, i) => (
                         <div key={i} className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center">
                               <Clock size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-sm">{p.name}</h4>
                               <p className="text-xs text-cream/60">Only {p.stock} units left</p>
                            </div>
                         </div>
                       ))}
                       {products.filter(p => p.stock < 10).length === 0 && (
                         <div className="text-center py-12">
                            <CheckCircle size={48} className="text-gold mx-auto mb-4 opacity-50" />
                            <p className="text-cream/60 font-medium">All products are well stocked!</p>
                         </div>
                       )}
                    </div>
                  </div>
                  <Box className="absolute -bottom-10 -right-10 text-white/5" size={200} />
               </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-beige/50">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-serif font-bold text-forest">Recent Orders</h3>
                  <button className="text-gold font-bold hover:underline">View All Orders</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-olive text-sm font-bold border-b border-beige uppercase tracking-wider">
                        <th className="pb-6 px-4">Order ID</th>
                        <th className="pb-6 px-4">Customer</th>
                        <th className="pb-6 px-4">Status</th>
                        <th className="pb-6 px-4">Total</th>
                        <th className="pb-6 px-4">Date</th>
                        <th className="pb-6 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige/50">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="group hover:bg-soft-white transition-all">
                          <td className="py-6 px-4 font-bold text-forest">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="py-6 px-4">
                            <div className="flex items-center space-x-3">
                               <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-forest font-bold">
                                 {order.user?.name.charAt(0)}
                               </div>
                               <span className="font-medium text-forest">{order.user?.name}</span>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-gold/10 text-gold'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-6 px-4 font-bold text-forest">{formatINR(order.totalPrice)}</td>
                          <td className="py-6 px-4 text-olive text-sm font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-6 px-4">
                            <button className="w-10 h-10 rounded-xl hover:bg-beige flex items-center justify-center transition-all">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
           <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-beige/50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-serif font-bold text-forest">Product Management</h3>
                <button className="btn-premium px-8 py-3 flex items-center space-x-2">
                   <Plus size={20} /> <span>Add Product</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                 {products.map((p) => (
                    <div key={p._id} className="bg-soft-white p-4 rounded-3xl border border-beige/30 group relative">
                       <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                          <img src={p.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                          <div className="absolute top-3 right-3 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                             <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg hover:text-gold transition-colors">
                                <Settings size={14} />
                             </button>
                          </div>
                       </div>
                       <h4 className="font-bold text-forest mb-1">{p.name}</h4>
                       <div className="flex justify-between items-center">
                          <p className="text-gold font-bold">{formatINR(p.price)}</p>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${p.stock < 10 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                             {p.stock} in stock
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
