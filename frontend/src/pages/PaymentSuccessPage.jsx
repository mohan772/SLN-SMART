import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ShoppingCart, Truck, MapPin } from 'lucide-react';
import api from '../services/api';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(
          `/payment/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleDownloadInvoice = () => {
    if (order?.invoiceUrl) {
      window.open(order.invoiceUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <div className="relative w-32 h-32">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-20"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-40"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute inset-4 bg-white rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-16 h-16 text-emerald-600" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-xl text-slate-600 mb-8"
          >
            Your order has been confirmed and is being prepared for delivery.
          </motion.p>
        </motion.div>

        {/* Order Details Card */}
        {!loading && order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl mb-8"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200">
              {/* Order Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-4">ORDER NUMBER</h3>
                <p className="text-2xl font-bold text-slate-900 font-mono mb-6">{order._id?.slice(-8).toUpperCase()}</p>

                <h3 className="text-sm font-semibold text-slate-600 mb-2">ORDER DATE</h3>
                <p className="text-slate-700 mb-6">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>

                <h3 className="text-sm font-semibold text-slate-600 mb-2">STATUS</h3>
                <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm">
                  {order.status}
                </span>
              </div>

              {/* Price Info */}
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{order.itemsPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold text-slate-900">₹{order.taxPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Delivery</span>
                    <span className="font-semibold text-slate-900">
                      {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice?.toFixed(2)}`}
                    </span>
                  </div>
                  {order.discountPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Discount</span>
                      <span className="font-semibold text-emerald-600">-₹{order.discountPrice?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-200 flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{order.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-slate-600">₹{item.price}/unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-t border-slate-200 pt-8">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Delivery Address</h4>
                  <p className="text-sm text-slate-600">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Truck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Delivery Slot</h4>
                  <p className="text-sm text-slate-600">{order.deliverySlot || 'To be assigned'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-900 font-semibold rounded-xl hover:bg-slate-300 transition"
              >
                <Truck className="w-5 h-5" />
                Track Order
              </button>
            </div>
          </motion.div>
        )}

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Continue Shopping
          </button>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 text-lg">
            Thank you for shopping with us! Track your order to know the delivery status anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
