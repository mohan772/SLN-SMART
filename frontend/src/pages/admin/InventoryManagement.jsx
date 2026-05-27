import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, TrendingUp, TrendingDown, ArrowRight, Save, Clock, HelpCircle, CheckCircle, List, PlusCircle } from 'lucide-react';
import { formatINR } from '../../utils/currency';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchLogs();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products');
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/inventory/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestock = async () => {
    if (!restockItem || !restockQty || isNaN(restockQty)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/inventory/restock/${restockItem._id}`, { 
        quantity: restockQty,
        reason: 'Manual Restock'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${restockItem.name} restocked successfully!`);
      setRestockItem(null);
      setRestockQty('');
      fetchProducts();
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to restock product');
    }
  };

  const handleGetSuggestion = async (id) => {
    try {
      setLoadingSuggestion(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/inventory/price-suggestion/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestion(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const applySuggestedPrice = async () => {
    if (!suggestion || !selectedProduct) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/products/${selectedProduct._id}`, { price: suggestion.suggestedPrice }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Price updated successfully!');
      fetchProducts();
      setSuggestion(null);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update price');
    }
  };

  const lowStockProducts = products.filter(p => p.stock < 20);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Inventory & Pricing</h1>
        <p className="text-slate-500 mt-1">Manage stock levels and optimize pricing dynamically</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts & Product List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <AlertCircle className="text-rose-500 mr-2" size={24} />
              Low Stock Alerts
            </h3>
            
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : lowStockProducts.length === 0 ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl flex items-center">
                <CheckCircle className="mr-3" />
                <p className="font-bold">All products have sufficient stock levels.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map(p => (
                  <div key={p._id} className="flex items-center justify-between bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <img src={p.images[0] || '/no-photo.jpg'} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900">{p.name}</h4>
                        <p className="text-sm text-rose-600 font-bold flex items-center mt-0.5">
                          <Clock size={14} className="mr-1" /> Only {p.stock} {p.unit} remaining
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setRestockItem(p)}
                      className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Management Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Dynamic Pricing Simulator</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Demand</th>
                    <th className="p-4">Current Price</th>
                    <th className="p-4 pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr 
                      key={p._id} 
                      className={`cursor-pointer transition-colors ${selectedProduct?._id === p._id ? 'bg-emerald-50' : 'hover:bg-slate-50/50'}`}
                      onClick={() => {
                        setSelectedProduct(p);
                        handleGetSuggestion(p._id);
                      }}
                    >
                      <td className="p-4 pl-6 font-medium text-slate-900">{p.name}</td>
                      <td className="p-4 text-slate-600">{p.stock} {p.unit}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          p.demandLevel === 'High' ? 'bg-rose-100 text-rose-700' : p.demandLevel === 'Low' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.demandLevel}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{formatINR(p.price)}</td>
                      <td className="p-4 pr-6">
                        <button className="text-emerald-600 text-sm font-bold hover:underline">Analyze</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Logs Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <List className="text-emerald-600 mr-2" size={24} />
              Recent Inventory Logs
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Change</th>
                    <th className="pb-4">New Stock</th>
                    <th className="pb-4">User/Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map(log => (
                    <tr key={log._id} className="text-sm">
                      <td className="py-4 text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 font-bold text-slate-900">{log.product?.name || 'Deleted Product'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.changeType === 'Restock' ? 'bg-emerald-100 text-emerald-700' :
                          log.changeType === 'Order Placed' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {log.changeType}
                        </span>
                      </td>
                      <td className={`py-4 font-bold ${log.quantityChanged > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                      </td>
                      <td className="py-4 text-slate-700">{log.newStock}</td>
                      <td className="py-4 text-slate-500 truncate max-w-[150px]">{log.reason || log.user?.name || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Suggestion Panel */}
        <div className="lg:col-span-1">
          <div className="bg-forest-900 text-white rounded-3xl p-8 sticky top-8 shadow-xl">
            <div className="flex items-center space-x-2 mb-6">
              <HelpCircle className="text-gold" />
              <h3 className="text-xl font-serif font-bold text-gold">Price Suggestion AI</h3>
            </div>
            
            {!selectedProduct ? (
              <div className="text-center py-12 px-4 opacity-70">
                <p>Select a product from the table to generate a demand-based pricing strategy.</p>
              </div>
            ) : loadingSuggestion ? (
              <div className="text-center py-12 opacity-70 animate-pulse">
                <p>Analyzing market demand, stock levels, and historical sales...</p>
              </div>
            ) : suggestion ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
                  <img src={selectedProduct.images[0] || '/no-photo.jpg'} className="w-16 h-16 rounded-2xl object-cover bg-white" alt="" />
                  <div>
                    <h4 className="font-bold text-lg">{selectedProduct.name}</h4>
                    <p className="text-cream/60 text-sm">Current Stock: {selectedProduct.stock}</p>
                  </div>
                </div>

                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <p className="text-sm leading-relaxed text-cream">{suggestion.suggestion}</p>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-5 rounded-2xl">
                  <div>
                    <p className="text-xs text-cream/60 uppercase tracking-wider mb-1">Current</p>
                    <p className="text-xl font-bold line-through opacity-70">{formatINR(suggestion.currentPrice)}</p>
                  </div>
                  <ArrowRight className="text-gold" />
                  <div className="text-right">
                    <p className="text-xs text-gold uppercase tracking-wider mb-1">Suggested</p>
                    <p className="text-3xl font-bold text-emerald-400">{formatINR(suggestion.suggestedPrice)}</p>
                  </div>
                </div>

                {suggestion.currentPrice !== suggestion.suggestedPrice && (
                  <button 
                    onClick={applySuggestedPrice}
                    className="w-full py-4 bg-gold text-forest-900 font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-yellow-400 transition"
                  >
                    <Save size={20} />
                    <span>Apply New Price</span>
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>

      </div>

      {/* Restock Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-slate-900">Restock Product</h3>
              <button onClick={() => setRestockItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="flex items-center space-x-4 mb-8 bg-slate-50 p-4 rounded-2xl">
              <img src={restockItem.images[0] || '/no-photo.jpg'} className="w-14 h-14 rounded-xl object-cover" alt="" />
              <div>
                <h4 className="font-bold text-slate-900">{restockItem.name}</h4>
                <p className="text-sm text-slate-500">Current Stock: {restockItem.stock} {restockItem.unit}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Restock Quantity ({restockItem.unit})</label>
                <input 
                  type="number" 
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  placeholder="Enter amount to add..."
                  className="w-full px-5 py-4 bg-slate-100 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold"
                />
              </div>
              
              <button 
                onClick={handleRestock}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 hover:bg-emerald-700 transition"
              >
                <PlusCircle size={20} />
                <span>Confirm Restock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
