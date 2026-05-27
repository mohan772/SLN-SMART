import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { formatINR } from '../utils/currency'

const defaultForm = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: '',
}

const AdminPage = () => {
  const [products, setProducts] = useState([])
  const [formValues, setFormValues] = useState(defaultForm)
  const [imageFile, setImageFile] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data.data)
    } catch (err) {
      setError('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setSelectedProduct(null)
    setFormValues(defaultForm)
    setImageFile(null)
    setError('')
    setSuccess('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0] || null)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormValues({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
    })
    setImageFile(null)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) {
      return
    }

    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((product) => product._id !== id))
      setSuccess('Product deleted successfully.')
      setError('')
    } catch (err) {
      setError('Unable to delete product.')
      setSuccess('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('name', formValues.name)
      formData.append('price', formValues.price)
      formData.append('category', formValues.category)
      formData.append('stock', formValues.stock)
      formData.append('description', formValues.description)
      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (selectedProduct) {
        const response = await api.put(`/products/${selectedProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setProducts((prev) => prev.map((item) => (item._id === response.data.data._id ? response.data.data : item)))
        setSuccess('Product updated successfully.')
      } else {
        const response = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setProducts((prev) => [response.data.data, ...prev])
        setSuccess('Product added successfully.')
      }

      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product.')
    } finally {
      setSaving(false)
    }
  }

  const categoryOptions = useMemo(() => {
    const categories = new Set(products.map((product) => product.category.toLowerCase()))
    return [...categories]
  }, [products])

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h2>
            <p className="mt-2 text-slate-600">Manage product inventory, edits, and uploads from this panel.</p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:border-emerald-500"
          >
            New Product
          </button>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">{selectedProduct ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Product name</label>
              <input
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Price</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.price}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Stock</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formValues.stock}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Category</span>
                <input
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Image</span>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full text-slate-700"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : selectedProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Current Inventory</h3>
          {loading ? (
            <p className="mt-4 text-slate-600">Loading products...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {products.map((product) => (
                <div key={product._id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1542444459-db0e1e6b0f38?auto=format&fit=crop&w=400&q=60'}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 rounded-3xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-semibold text-slate-900">{product.name}</h4>
                      <p className="text-sm text-slate-600">{product.category}</p>
                      <p className="mt-2 text-sm text-slate-700">
                        {formatINR(product.price)} · Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:border-emerald-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!products.length && <p className="text-slate-600">No products available yet.</p>}
            </div>
          )}
        </div>
      </section>

      {categoryOptions.length > 0 && (
        <section className="rounded-3xl bg-slate-50 border border-slate-200 p-6 text-slate-700">
          <h4 className="text-lg font-semibold text-slate-900">Existing categories</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <span key={option} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                {option}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default AdminPage
