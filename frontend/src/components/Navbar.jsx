import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/#categories' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center"
              >
                <span className="text-cream font-serif text-2xl font-bold">S</span>
              </motion.div>
              <span className={`text-2xl font-serif font-bold ${scrolled ? 'text-forest' : 'text-forest'}`}>
                SLN <span className="text-gold">Smart</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="text-forest font-medium hover:text-gold transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-5">
              <button className="text-forest hover:text-gold transition-colors">
                <Search size={22} />
              </button>
              {(!user || user.role !== 'admin') && (
                <>
                  <Link to="/wishlist" className="text-forest hover:text-gold transition-colors relative">
                    <Heart size={22} />
                    <span className="absolute -top-2 -right-2 bg-gold text-forest text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                  </Link>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="text-forest hover:text-gold transition-colors relative"
                  >
                    <ShoppingCart size={22} />
                    <span className="absolute -top-2 -right-2 bg-forest text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                  </button>
                </>
              )}
              
              <div className="h-6 w-px bg-beige mx-2"></div>

              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gold font-bold hover:text-forest transition-colors bg-forest/5 px-3 py-1.5 rounded-lg border border-gold/30">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" className="flex items-center space-x-2 text-forest hover:text-gold transition-colors">
                    <div className="w-8 h-8 rounded-full bg-beige flex items-center justify-center overflow-hidden">
                      {user.avatar ? <img src={user.avatar} alt={user?.name || user?.username || 'User'} /> : <User size={18} />}
                    </div>
                    <span className="font-medium">{user?.name?.split(' ')[0] || user?.username || 'User'}</span>
                  </Link>
                  <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="text-forest hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-premium py-2 px-6">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {(!user || user.role !== 'admin') && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-forest relative"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-forest text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                </button>
              )}
              <button onClick={() => setIsOpen(!isOpen)} className="text-forest">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-beige overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-xl font-serif text-forest hover:bg-cream rounded-xl"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-3">
                  {user ? (
                    <>
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsOpen(false)}
                          className="btn-premium text-center bg-gold text-forest hover:bg-yellow-500"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsOpen(false)}
                        className="btn-premium text-center"
                      >
                        My Dashboard
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                        className="btn-outline text-center"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="btn-premium text-center"
                    >
                      Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
