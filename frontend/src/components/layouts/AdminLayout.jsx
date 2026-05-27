import { Outlet, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Overview', path: '/admin' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Analytics', path: '/admin/analytics' },
]

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f6f2e8] text-slate-900">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-800">Admin Console</p>
            <h1 className="text-2xl font-semibold text-slate-900">SLN Market Intelligence</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-emerald-700 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_3fr]">
        <motion.aside
          className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-800">Management</p>
              <p className="text-xl font-semibold text-slate-900">Control center</p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p>Monitor stock, review orders, and manage products with premium analytics.</p>
              <p>Use the left navigation and action cards to explore every section.</p>
            </div>
          </div>
        </motion.aside>
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-8"
        >
          <Outlet />
        </motion.section>
      </div>
    </div>
  )
}

export default AdminLayout
