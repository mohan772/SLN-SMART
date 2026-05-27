import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });
  const [deliverySlot, setDeliverySlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const calculatePrices = () => {
    const itemsPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxPrice = itemsPrice * 0.05;
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const discountPrice = couponDiscount;
    const totalPrice = itemsPrice + taxPrice + shippingPrice - discountPrice;
    return { itemsPrice, taxPrice, shippingPrice, discountPrice, totalPrice };
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error('Enter coupon code');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/coupons/validate`,
        { code: couponCode }
      );
      if (response.data.success) {
        setCouponDiscount(response.data.discount);
        toast.success(`Coupon applied! Save ₹${response.data.discount}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.postalCode) {
      toast.error('Please fill all delivery address fields');
      return;
    }
    if (!deliverySlot) {
      toast.error('Please select a delivery slot');
      return;
    }

    setLoading(true);
    try {
      const { itemsPrice, taxPrice, shippingPrice, discountPrice, totalPrice } = calculatePrices();
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-order`,
        {
          orderItems: cart,
          shippingAddress: deliveryAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          discountPrice,
          totalPrice,
          deliverySlot,
          specialInstructions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const { orderId, razorpayOrderId, razorpayKeyId, amount } = orderResponse.data;

      const options = {
        key: razorpayKeyId,
        amount: amount * 100,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'SLN Smart Vegetable Shop',
        description: 'Premium Grocery Delivery',
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify-payment`,
              {
                orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              localStorage.removeItem('cart');
              navigate(`/payment-success?orderId=${orderId}`);
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#10b981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const { itemsPrice, taxPrice, shippingPrice, discountPrice, totalPrice } = calculatePrices();
  const deliverySlots = [
    'Today 2-4 PM',
    'Today 4-6 PM',
    'Today 6-8 PM',
    'Tomorrow 10 AM-12 PM',
    'Tomorrow 12-2 PM',
    'Tomorrow 2-4 PM',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={deliveryAddress.address}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, address: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={deliveryAddress.city}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={deliveryAddress.postalCode}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <textarea
                  placeholder="Special instructions (optional)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none resize-none h-20"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">Select Delivery Slot</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {deliverySlots.map((slot) => (
                  <motion.button
                    key={slot}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeliverySlot(slot)}
                    className={`py-3 px-4 rounded-xl font-medium transition ${
                      deliverySlot === slot
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {['razorpay', 'cod'].map((method) => (
                  <label
                    key={method}
                    className="flex items-center p-4 rounded-xl bg-slate-50 border-2 cursor-pointer transition"
                    style={{
                      borderColor: paymentMethod === method ? '#10b981' : '#e2e8f0',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-4 font-semibold text-slate-700">
                      {method === 'razorpay' ? 'Razorpay (UPI, Card, Wallet)' : 'Cash on Delivery'}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-1 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-2xl sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} <span className="opacity-75">x{item.quantity}</span>
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/30 pt-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="opacity-90">Subtotal</span>
                  <span>₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Tax (5%)</span>
                  <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Delivery</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                </div>
                {discountPrice > 0 && (
                  <div className="flex justify-between text-emerald-100">
                    <span>Discount</span>
                    <span>-₹{discountPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="mb-6 bg-white/10 rounded-lg p-3">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-white/20 text-white placeholder-white/50 outline-none border border-white/30"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded font-semibold transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div className="border-t border-white/30 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-white text-emerald-600 font-bold py-4 rounded-xl hover:bg-slate-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Truck className="w-5 h-5" />
                {loading ? 'Processing...' : 'Continue to Payment'}
              </motion.button>
              <p className="text-center text-sm opacity-75 mt-4">
                🔒 Secure checkout powered by Razorpay
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
