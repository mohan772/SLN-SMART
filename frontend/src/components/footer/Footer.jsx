import { motion } from 'framer-motion'
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-forest text-cream pt-20 pb-10">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10 6 6 8 4 12c2 0 4-1 6-1s4 1 6 1c-1.5-4-4-6-4-10z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">SLN Produce</span>
            </Link>
            <p className="text-cream/70 max-w-sm">
              We are dedicated to revolutionizing the way you experience fresh produce. From sustainable farming to your table, quality is our promise.
            </p>
            <div className="flex items-center gap-3">
              {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                <button key={idx} className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-light text-cream hover:bg-emerald-500 transition-colors">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Shop</h3>
            <ul className="space-y-4 text-cream/70">
              <li><Link to="/shop" className="hover:text-emerald-400 transition-colors">Marketplace</Link></li>
              <li><Link to="/categories" className="hover:text-emerald-400 transition-colors">Collections</Link></li>
              <li><Link to="/featured" className="hover:text-emerald-400 transition-colors">Featured Produce</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Company</h3>
            <ul className="space-y-4 text-cream/70">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Our Story</Link></li>
              <li><Link to="/farmers" className="hover:text-emerald-400 transition-colors">Meet the Farmers</Link></li>
              <li><Link to="/sustainability" className="hover:text-emerald-400 transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Support</h3>
            <ul className="space-y-4 text-cream/70">
              <li><Link to="/help" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-emerald-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-emerald-800/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-cream/40 text-sm">
            © 2026 SLN Produce Co. All rights reserved.
          </p>
          <div className="flex gap-8 text-cream/40 text-sm">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

export default Footer
