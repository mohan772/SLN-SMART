import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/currency'

const Orders = () => {
  const { orders, fetchUserOrders } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        await fetchUserOrders()
      } catch (err) {
        setError('Unable to fetch your orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [fetchUserOrders])

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Order History</h2>
        <p className="mt-2 text-slate-600">Review your recent purchases and status updates.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm text-slate-600">Loading orders...</div>
      ) : error ? (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-red-700">{error}</div>
      ) : !orders.length ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm text-slate-600">
          No orders yet. Complete checkout to start your order history.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p className="mt-1 text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1 text-right text-sm text-slate-600">
                  <p>Total: {formatINR(order.totalAmount)}</p>
                  <p>Payment: {order.paymentStatus}</p>
                  <p>Status: {order.orderStatus}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {order.products.map((item) => (
                  <div key={item.product} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-slate-900">{formatINR(item.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Orders
