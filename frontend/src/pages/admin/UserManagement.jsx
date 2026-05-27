import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Shield, ShieldOff, Search, Phone, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, verified, unverified, blocked

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/auth/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling block status:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.phone?.includes(searchTerm) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'verified') return matchesSearch && user.isVerified;
    if (filter === 'unverified') return matchesSearch && !user.isVerified;
    if (filter === 'blocked') return matchesSearch && user.blocked;
    return matchesSearch;
  });

  if (loading) return <div className="p-8 text-olive">Loading user records...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-serif font-bold text-forest mb-2">User Management</h1>
        <p className="text-olive">View and manage your registered customers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-beige">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-olive" size={20} />
          <input 
            type="text"
            placeholder="Search by name, phone or email..."
            className="w-full pl-12 pr-4 py-3 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 p-1 bg-soft-white rounded-2xl border border-beige">
          {['all', 'verified', 'unverified', 'blocked'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-forest text-white shadow-md' : 'text-olive hover:bg-beige/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={user._id}
            className={`bg-white p-6 rounded-[2rem] shadow-sm border-2 transition-all ${
              user.blocked ? 'border-red-100 bg-red-50/30' : 'border-beige'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                  user.blocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-forest text-lg">{user.name}</h3>
                  <div className="flex items-center gap-2">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle size={10} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <XCircle size={10} /> Unverified
                      </span>
                    )}
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                </div>
              </div>
              
              {user.role !== 'admin' && (
                <button
                  onClick={() => toggleBlock(user._id)}
                  className={`p-3 rounded-2xl transition-all ${
                    user.blocked 
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={user.blocked ? 'Unblock User' : 'Block User'}
                >
                  {user.blocked ? <Shield size={20} /> : <ShieldOff size={20} />}
                </button>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-olive">
                <Phone size={16} className="text-gold" />
                <span className="text-sm font-medium">{user.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-olive">
                <Mail size={16} className="text-gold" />
                <span className="text-sm font-medium truncate">{user.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-olive">
                <Calendar size={16} className="text-gold" />
                <span className="text-sm font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-beige flex justify-between items-center text-[10px] font-bold text-olive/60 uppercase tracking-widest">
              <span>ID: {user._id.slice(-8)}</span>
              <span>Status: {user.blocked ? 'Blocked' : 'Active'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-beige">
          <User size={48} className="mx-auto text-beige mb-4" />
          <h3 className="text-xl font-bold text-forest">No users found</h3>
          <p className="text-olive">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
