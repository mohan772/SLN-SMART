import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ClipboardList, 
  Archive, 
  Users, 
  BarChart3, 
  Gift, 
  Settings,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { formatINR } from '../utils/currency';

const navLinks = [
  { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', name: 'Products', icon: Package },
  { path: '/admin/categories', name: 'Categories', icon: Tags },
  { path: '/admin/orders', name: 'Orders', icon: ClipboardList },
  { path: '/admin/inventory', name: 'Inventory', icon: Archive },
  { path: '/admin/customers', name: 'Customers', icon: Users },
  { path: '/admin/analytics', name: 'Analytics', icon: BarChart3 },
  { path: '/admin/offers', name: 'Offers', icon: Gift },
  { path: '/admin/settings', name: 'Settings', icon: Settings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/orders/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRevenue(res.data.data.totalRevenue || 0);
      } catch (err) {
        console.error('Failed to fetch revenue', err);
      }
    };
    fetchRevenue();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F6F1E9] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-emerald-800">
          <h1 className="text-2xl font-bold text-gold tracking-tight">SLN Smart Admin</h1>
          <p className="text-xs text-cream/70 uppercase tracking-widest mt-1">Merchant Panel</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gold text-emerald-950 font-bold shadow-md' 
                    : 'text-cream/80 hover:bg-emerald-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-emerald-950' : 'text-cream/70'} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-cream/80 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="bg-transparent border-none outline-none ml-3 w-full text-sm text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex flex-col items-end mr-4">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Revenue</span>
              <span className="text-lg font-bold text-emerald-700">{formatINR(revenue)}</span>
            </div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <img 
                src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=0F3D2E&color=fff"} 
                alt="Admin Profile" 
                className="w-10 h-10 rounded-full border-2 border-gold object-cover"
              />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'admin@sln.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
