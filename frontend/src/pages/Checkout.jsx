import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/currency'

const Checkout = () => {
  const { cartItems, cartTotal, createOrder } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await createOrder()
      setSuccess('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      setError(err.message || 'Unable to place order.')
    } finally {
      setLoading(false)
    }
  }

  if (!cartItems.length) {
    return (
      <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-slate-900">No items in cart</h2>
        <p className="mt-3 text-slate-600">Add items to your cart before checking out.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
        >
          Browse products
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Checkout</h2>
        <p className="mt-2 text-slate-600">Review your order and place it securely.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-slate-900">{formatINR(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-700">
              <span>Subtotal</span>
              <span>{formatINR(cartTotal)}</span>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              Payment and delivery will be confirmed after order placement.
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Checkout
