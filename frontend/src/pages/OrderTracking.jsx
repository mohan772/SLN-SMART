import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import { formatINR } from '../utils/currency';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      setError('Order not found. Please check your Order ID and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <SectionTitle
        eyebrow="Track order"
        title="Follow your delivery from farm to doorstep"
        description="Enter your order details and check its current status in real time."
      />

      <div className="mt-10 flex justify-center">
        <form onSubmit={handleTrack} className="relative w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., 64f1...)" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full pl-6 pr-32 py-5 bg-white border border-slate-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition text-lg"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition font-bold disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Now'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-8 p-6 bg-rose-50 border border-rose-100 text-rose-700 rounded-3xl text-center max-w-lg mx-auto">
          {error}
        </div>
      )}

      {order && (
        <div className="mt-12 space-y-8 animate-fade-in">
          {/* Summary Card */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Order ID</p>
              <h3 className="text-2xl font-bold text-slate-900">#{order._id.toUpperCase()}</h3>
            </div>
            <div>
              <p className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Status</p>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Total Amount</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatINR(order.totalPrice)}</h3>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-12">Delivery Timeline</h4>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-slate-100 -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                />
              </div>

              {statuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={status} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-4 w-full md:w-auto">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                      ${isCompleted ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}
                      ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}
                    `}>
                      {index === 0 && <Clock size={20} />}
                      {index === 1 && <Package size={20} />}
                      {index === 2 && <Truck size={20} />}
                      {index === 3 && <MapPin size={20} />}
                      {index === 4 && <CheckCircle size={20} />}
                    </div>

                    <div className="text-left md:text-center">
                      <p className={`font-bold text-sm ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {status}
                      </p>
                      {isCurrent && (
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter mt-0.5">In Progress</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <Package className="mr-2 text-emerald-600" size={20} />
                  Items in this order
                </h4>
                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-700 text-sm">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <MapPin className="mr-2 text-emerald-600" size={20} />
                  Delivery Address
                </h4>
                <div className="text-slate-600 space-y-2">
                  <p className="font-bold text-slate-900">{order.user?.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Payment: {order.paymentMethod}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
