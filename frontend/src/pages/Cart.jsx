import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatINR } from '../utils/currency'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const cartItems = cart?.items || []
  const cartSubtotal = cartItems.reduce((acc, item) => acc + ((item.product?.discountPrice || item.product?.price || 0) * item.quantity), 0)
  const deliveryFee = cartSubtotal > 500 ? 0 : 50
  const taxAmount = cartSubtotal * 0.05
  const estimatedTotal = cartSubtotal + deliveryFee + taxAmount
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [message, setMessage] = useState('')
  const { createToast } = useToast()

  if (!cartItems.length) {
    return (
      <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm text-center">
        <h2 className="text-3xl font-semibold text-slate-900">Your cart is empty</h2>
        <p className="mt-4 text-slate-600">Grab premium vegetables from the shop and build a healthier basket.</p>
        <Link to="/shop" className="mt-8 inline-flex rounded-full bg-emerald-900 px-6 py-3 text-white shadow-lg hover:bg-emerald-800">
          Browse Shop
        </Link>
      </section>
    )
  }

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FRESH20') {
      setDiscount(20)
      setMessage('Coupon applied successfully!')
      createToast('Coupon applied: ₹20 off', 'success')
      return
    }
    setMessage('Coupon code not valid for this order.')
    createToast('Invalid coupon code', 'error')
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-slate-900">Your Cart</h2>
        <p className="mt-3 text-slate-600">Review the freshest selections from your order basket before checkout.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[2.2fr_1fr]">
        <div className="space-y-5">
          {cartItems.map((item) => {
            const product = item.product || {};
            const productId = product._id || product.id;
            const price = product.discountPrice || product.price || 0;
            return (
              <article key={item.id || productId} className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60'} alt={product.name} className="h-28 w-28 rounded-[1.75rem] object-cover" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">Category: {product.category?.name || product.categorySlug || 'Fresh'}</p>
                    <p className="mt-2 text-sm text-emerald-700">{formatINR(price)} each</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <button className="rounded-full bg-slate-100 px-4 py-2" onClick={() => updateQuantity(productId, Math.max(item.quantity - 1, 1))}>-</button>
                    <span className="min-w-[3rem] text-center font-semibold">{item.quantity}</span>
                    <button className="rounded-full bg-slate-100 px-4 py-2" onClick={() => updateQuantity(productId, item.quantity + 1)}>+</button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600">Subtotal:</span>
                    <span className="text-lg font-semibold text-slate-900">{formatINR(price * item.quantity)}</span>
                  </div>
                  <button onClick={() => removeFromCart(productId)} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                    Remove
                  </button>
                </div>
              </article>
            )
          })}

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Promo code</h3>
            <p className="mt-2 text-sm text-slate-600">Use FRESH20 for an instant premium discount.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              />
              <button onClick={handleApplyCoupon} className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                Apply
              </button>
            </div>
            {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
          </div>
        </div>

        <aside className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-800">Order summary</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Secure checkout</h3>
            </div>
            <div className="space-y-4 rounded-[2rem] bg-slate-50 p-6">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span>{formatINR(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span>{formatINR(taxAmount)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-700">
                  <span>Discount</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
                Total <span className="float-right">{formatINR(estimatedTotal - discount)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block rounded-full bg-emerald-900 px-6 py-4 text-center text-sm font-semibold text-white shadow-xl shadow-emerald-900/10 hover:bg-emerald-800">
              Continue to Checkout
            </Link>
            <button onClick={clearCart} className="w-full rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Clear Cart
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Cart
