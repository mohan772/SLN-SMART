import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Filter } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import ProductFormModal from '../../components/admin/ProductFormModal';

const ProductManagement = ({ categoryId, hideHeader }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = categoryId ? `/api/products?category=${categoryId}` : '/api/products';
      const res = await axios.get(url);
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleVisibility = async (product) => {
    if (!window.confirm(`Mark this product as ${product.visibility ? 'unavailable' : 'available'}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/products/${product._id}`,
        { visibility: !product.visibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      console.error('Failed to update product visibility', err);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={hideHeader ? "" : "max-w-7xl mx-auto"}>
      {!hideHeader && (
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Products</h1>
            <p className="text-slate-500 mt-1">Manage your store's inventory and pricing</p>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-200"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Category Products</h2>
          <button 
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-200 text-sm"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-5 py-3 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-bold">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {/* Products Grouped by Category */}
        <div className="overflow-x-auto bg-slate-50/50 pb-8">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No products found.</div>
          ) : (
            Object.entries(
              filteredProducts.reduce((acc, product) => {
                const catName = product.category?.name || 'Uncategorized';
                if (!acc[catName]) acc[catName] = [];
                acc[catName].push(product);
                return acc;
              }, {})
            ).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="mb-8 bg-white border-y border-slate-200 shadow-sm first:border-t-0">
                <div className="px-8 py-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">{categoryName}</h3>
                  <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{categoryProducts.length} Items</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-bold">
                      <th className="p-4 pl-8">Product</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-center">Stock</th>
                      <th className="p-4 text-center">Demand</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 pr-8 text-right sticky right-0 bg-white shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categoryProducts.map(product => (
                      <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 pl-8">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={product.images?.[0] || '/no-photo.jpg'} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{product.name}</p>
                              {product.trending && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide mt-1 inline-block">Trending</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900">
                          {formatINR(product.price)}
                          {product.discountPrice > 0 && (
                            <p className="text-xs text-rose-500 line-through font-normal">{formatINR(product.discountPrice)}</p>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.stock < 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {product.stock} {product.unit}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs font-bold ${
                            product.demandLevel === 'High' ? 'text-rose-600' : product.demandLevel === 'Low' ? 'text-amber-600' : 'text-slate-500'
                          }`}>
                            {product.demandLevel}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            product.visibility ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {product.visibility ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="p-4 pr-8 sticky right-0 bg-white group-hover:bg-slate-50/50 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] transition-colors z-10">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View"><Eye size={18} /></button>
                            <button onClick={() => handleToggleVisibility(product)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition" title={product.visibility ? 'Hide product' : 'Make product available'}>
                              {product.visibility ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        refreshProducts={fetchProducts}
      />
    </div>
  );
};

export default ProductManagement;
