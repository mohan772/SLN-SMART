import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import ProductManagement from './ProductManagement';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    visibility: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
      
      // Update selected category if it was updated
      if (selectedCategory) {
        const updatedCat = res.data.data.find(c => c._id === selectedCategory._id);
        if (updatedCat) setSelectedCategory(updatedCat);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/categories', formData);
      }

      await fetchCategories();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save category');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      if (selectedCategory?._id === id) setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (category, e) => {
    if (e) e.stopPropagation();
    try {
      await api.put(
        `/categories/${category._id}`,
        { visibility: !category.visibility }
      );
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category visibility', err);
    }
  };

  if (selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center space-x-2 text-slate-500 hover:text-emerald-600 transition font-bold mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Categories</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-center p-8 space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-40 h-40 shrink-0 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
            {selectedCategory.image && selectedCategory.image !== 'no-category-image.jpg' ? (
              <img src={selectedCategory.image} alt={selectedCategory.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon size={48} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-4xl font-serif font-bold text-slate-900">{selectedCategory.name}</h1>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedCategory.visibility !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {selectedCategory.visibility !== false ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="text-slate-600 text-lg mb-6 max-w-3xl">{selectedCategory.description}</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => openEditCategory(selectedCategory)}
                className="btn-outline flex items-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Edit2 size={18} />
                <span>Edit Category Details</span>
              </button>
              <button 
                onClick={() => handleToggleVisibility(selectedCategory)}
                className="btn-outline flex items-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {selectedCategory.visibility !== false ? <XCircle size={18} /> : <CheckCircle size={18} />}
                <span>{selectedCategory.visibility !== false ? 'Hide Category' : 'Show Category'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reusing ProductManagement component but filtered by this category */}
        <ProductManagement categoryId={selectedCategory._id} hideHeader={true} />

        {/* Modal for editing category */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Edit Category
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Update name, description, image URL and availability.</p>
                </div>
                <button onClick={closeModal} className="text-slate-500 hover:text-slate-900 transition">Close</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
                {error && <div className="rounded-xl bg-rose-50 text-rose-700 px-4 py-3">{error}</div>}
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Image URL</span>
                    <input
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="visibility"
                    checked={formData.visibility}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Category is available on store</span>
                </label>
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                  <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-6 py-3 text-slate-700 hover:bg-slate-100 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="rounded-2xl bg-emerald-600 px-6 py-3 text-white font-bold hover:bg-emerald-700 transition disabled:opacity-60">
                    {saving ? 'Saving...' : 'Update Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 mt-1">Select a category to view and manage its products</p>
        </div>
        <button
          onClick={openAddCategory}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-slate-500 col-span-full">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-slate-500 col-span-full">No categories found.</p>
        ) : (
          categories.map((category) => {
            const isVisible = category.visibility !== false;
            return (
              <div 
                key={category._id} 
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-48 bg-slate-100 relative">
                  {category.image && category.image !== 'no-category-image.jpg' ? (
                    <img src={category.image} className="w-full h-full object-cover" alt={category.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isVisible ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleVisibility(category)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold transition ${isVisible ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {isVisible ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      <span>{isVisible ? 'Hide' : 'Show'}</span>
                    </button>
                    <button
                      onClick={() => openEditCategory(category)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                      title="Edit category"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition"
                      title="Delete category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Update name, description, image URL and availability.</p>
              </div>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-900 transition">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
              {error && <div className="rounded-xl bg-rose-50 text-rose-700 px-4 py-3">{error}</div>}
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Image URL</span>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="visibility"
                  checked={formData.visibility}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">Category is available on store</span>
              </label>
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-6 py-3 text-slate-700 hover:bg-slate-100 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-emerald-600 px-6 py-3 text-white font-bold hover:bg-emerald-700 transition disabled:opacity-60">
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
