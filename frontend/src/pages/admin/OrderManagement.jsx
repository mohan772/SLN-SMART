import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Filter, Download } from 'lucide-react';
import { formatINR } from '../../utils/currency';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to export orders');
    } finally {
      setExporting(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    (o.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 mt-1">Manage customer orders and update delivery status</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-bold shadow-lg shadow-emerald-100 disabled:opacity-50"
        >
          <Download size={20} />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-5 py-3 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-bold">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
...

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-5 pl-8">Order ID</th>
                <th className="p-5">Date</th>
                <th className="p-5">Customer</th>
                <th className="p-5 text-right">Amount</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center text-slate-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-slate-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 pl-8 font-bold text-emerald-700">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-5 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{order.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{order.shippingAddress?.city}</div>
                    </td>
                    <td className="p-5 text-right font-bold text-slate-900">{formatINR(order.totalPrice)}</td>
                    <td className="p-5 text-center">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                          order.status === 'Refunded' ? 'bg-slate-200 text-slate-700' :
                          'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition inline-flex items-center space-x-1">
                        <Eye size={18} />
                        <span className="text-xs font-bold hidden md:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
