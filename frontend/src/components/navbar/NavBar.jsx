import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import CartDrawer from '../CartDrawer'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiMenu, FiX, FiUser } from 'react-icons/fi'
import { useState } from 'react'
import SearchBar from './SearchBar'

const menuItems = [
  { label: 'Market', to: '/shop' },
  { label: 'Collections', to: '/categories' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Sustainability', to: '/about' },
]

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex items-center justify-between gap-5 py-4">
        <Link to="/" className="inline-flex items-center gap-3 group shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-white shadow-premium transition-transform group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10 6 6 8 4 12c2 0 4-1 6-1s4 1 6 1c-1.5-4-4-6-4-10z" fill="currentColor" />
              <circle cx="17" cy="7" r="3" fill="#EADBC8" />
            </svg>
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-xl font-bold tracking-tight text-forest leading-none">SLN</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Premium</span>
          </div>
        </Link>
        
        <div className="flex-1 max-w-xl hidden md:block px-4">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-6 lg:flex shrink-0">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-forest border-b-2 border-emerald-900 pb-1' : 'text-slate-500 hover:text-forest'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>


        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-forest hover:text-white"
          >
            <FiShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-colors">
                  <FiUser />
                </div>
                <span className="text-sm font-bold text-slate-700">{user?.name?.split(' ')[0] || user?.username || 'User'}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-premium !py-2.5 !px-6 !text-sm">
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors md:hidden"
        >
          {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200 bg-white px-6 py-8 md:hidden"
        >
          <div className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-lg font-bold text-slate-900"
              >
                {item.label}
              </NavLink>
            ))}
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(true)
                  setOpen(false)
                }}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold text-slate-900"
              >
                <span className="flex items-center gap-3"><FiShoppingCart /> Cart</span>
                <span className="bg-forest text-white px-3 py-1 rounded-full text-xs">{cartCount}</span>
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="btn-premium text-center"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="text-center font-bold text-rose-500 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-premium text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
    </>
  )
}

export default NavBar
