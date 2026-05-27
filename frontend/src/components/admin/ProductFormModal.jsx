import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload, Plus } from 'lucide-react';

const ProductFormModal = ({ isOpen, onClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    unit: 'kg',
    category: '',
    categorySlug: '',
    trending: false,
    seasonal: false,
    isOrganic: true,
    visibility: true,
    demandLevel: 'Normal',
    calories: '',
    vitamins: '',
    minerals: '',
    supplierName: '',
    supplierContact: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          discountPrice: product.discountPrice || '',
          stock: product.stock || '',
          unit: product.unit || 'kg',
          category: product.category?._id || product.category || '',
          categorySlug: product.categorySlug || '',
          trending: product.trending || false,
          seasonal: product.seasonal || false,
          isOrganic: product.isOrganic ?? true,
          visibility: product.visibility ?? true,
          demandLevel: product.demandLevel || 'Normal',
          calories: product.nutritionalInfo?.calories || '',
          vitamins: product.nutritionalInfo?.vitamins?.join(', ') || '',
          minerals: product.nutritionalInfo?.minerals?.join(', ') || '',
          supplierName: product.supplier?.name || '',
          supplierContact: product.supplier?.contactInfo || '',
        });
      } else {
        // reset form
        setFormData({
          name: '', description: '', price: '', discountPrice: '', stock: '', unit: 'kg', 
          category: '', categorySlug: '', trending: false, seasonal: false, isOrganic: true, 
          visibility: true, demandLevel: 'Normal', calories: '', vitamins: '', minerals: '',
          supplierName: '', supplierContact: ''
        });
      }
      setImages(null);
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (!['calories', 'vitamins', 'minerals', 'supplierName', 'supplierContact'].includes(key)) {
          data.append(key, formData[key]);
        }
      });

      data.append('nutritionalInfo', JSON.stringify({
        calories: formData.calories,
        vitamins: formData.vitamins.split(',').map(v => v.trim()),
        minerals: formData.minerals.split(',').map(m => m.trim())
      }));

      data.append('supplier', JSON.stringify({
        name: formData.supplierName,
        contactInfo: formData.supplierContact
      }));

      if (images) {
        for (let i = 0; i < images.length; i++) {
          data.append('images', images[i]);
        }
      }

      if (product) {
        await axios.put(`/api/products/${product._id}`, data, config);
      } else {
        await axios.post('/api/products', data, config);
      }

      refreshProducts();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto animate-slide-in-right p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category Slug</label>
              <input type="text" name="categorySlug" value={formData.categorySlug} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Discount Price (₹)</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Stock Quantity</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="kg">kg</option>
                <option value="g">gram</option>
                <option value="piece">piece</option>
                <option value="bunch">bunch</option>
                <option value="litre">litre</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Product Images</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-sm text-slate-500">Click or drag images to upload</p>
                {images && <p className="text-xs text-emerald-600 mt-2 font-bold">{images.length} files selected</p>}
              </div>
            </div>

            <div className="col-span-2 bg-slate-50 p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-slate-800">Toggles & Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  <span className="text-slate-700">Organic Product</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="trending" checked={formData.trending} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  <span className="text-slate-700">Trending Item</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="seasonal" checked={formData.seasonal} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  <span className="text-slate-700">Seasonal</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="visibility" checked={formData.visibility} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  <span className="text-slate-700">Visible on Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">Demand Level</label>
                <select name="demandLevel" value={formData.demandLevel} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Nutritional Info</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Calories</label>
                  <input type="text" name="calories" value={formData.calories} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Vitamins (comma sep)</label>
                  <input type="text" name="vitamins" value={formData.vitamins} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Minerals (comma sep)</label>
                  <input type="text" name="minerals" value={formData.minerals} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Supplier Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Supplier Name</label>
                  <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Contact Info</label>
                  <input type="text" name="supplierContact" value={formData.supplierContact} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
