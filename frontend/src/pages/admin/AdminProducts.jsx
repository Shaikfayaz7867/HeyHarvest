import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Star,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Pure 4 Suta',
    size: '12-16mm',
    packSize: '200g',
    price: '',
    discountPrice: '',
    inventory: 0,
    sku: '',
    material: 'Premium Makhana',
    colors: '', // comma separated
    tags: '', // comma separated
    weight: 200,
    nutritionInfo: {
      protein: '', carbs: '', fat: '', fiber: '', calories: ''
    },
    dimensions: { length: '', width: '', height: '' },
    isActive: true,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '' // comma separated
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'roasted', label: 'Roasted Makhana' },
    { value: 'flavored', label: 'Flavored Makhana' },
    { value: 'raw', label: 'Raw Makhana' },
    { value: 'gift-packs', label: 'Gift Packs' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/products', {
        params: {
          page: currentPage,
          search: searchTerm,
          category: selectedCategory,
          limit: 10,
        },
      })
      setProducts(response.data.products)
      setTotalPages(response.data.pagination?.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    // Revoke preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    setForm({
      name: '', description: '', category: 'Pure 4 Suta', size: '12-16mm', packSize: '200g',
      price: '', discountPrice: '', inventory: 0, sku: '', material: 'Premium Makhana',
      colors: '', tags: '', weight: 200,
      nutritionInfo: { protein: '', carbs: '', fat: '', fiber: '', calories: '' },
      dimensions: { length: '', width: '', height: '' },
      isActive: true, isFeatured: false, seoTitle: '', seoDescription: '', seoKeywords: ''
    })
    setImageFiles([])
    setImagePreviews([])
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    // Create previews and merge with existing
    const previews = files.map(f => URL.createObjectURL(f))
    setImageFiles(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...previews])
  }

  const removeImageAt = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      const toRevoke = prev[index]
      if (toRevoke) URL.revokeObjectURL(toRevoke)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleNutritionChange = (key, value) => {
    setForm(prev => ({ ...prev, nutritionInfo: { ...prev.nutritionInfo, [key]: value } }))
  }

  const handleDimensionsChange = (key, value) => {
    setForm(prev => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }))
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }
    if (!form.name || !form.description || !form.category || !form.size || !form.packSize || !form.price || !form.inventory || !form.sku) {
      toast.error('Please fill all required fields')
      return
    }
    if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
      toast.error('Discount price must be less than price')
      return
    }

    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('size', form.size)
      fd.append('packSize', form.packSize)
      fd.append('price', String(form.price))
      if (form.discountPrice) fd.append('discountPrice', String(form.discountPrice))
      fd.append('inventory', String(form.inventory))
      fd.append('sku', form.sku.toUpperCase())
      if (form.material) fd.append('material', form.material)
      // arrays
      form.colors.split(',').map(s => s.trim()).filter(Boolean).forEach(c => fd.append('colors[]', c))
      form.tags.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).forEach(t => fd.append('tags[]', t))
      form.seoKeywords.split(',').map(s => s.trim()).filter(Boolean).forEach(k => fd.append('seoKeywords[]', k))
      // nested objects
      Object.entries(form.nutritionInfo).forEach(([k, v]) => { if (v) fd.append(`nutritionInfo[${k}]`, v) })
      Object.entries(form.dimensions).forEach(([k, v]) => { if (v) fd.append(`dimensions[${k}]`, String(v)) })
      fd.append('weight', String(form.weight || 200))
      fd.append('isActive', String(form.isActive))
      fd.append('isFeatured', String(form.isFeatured))
      if (form.seoTitle) fd.append('seoTitle', form.seoTitle)
      if (form.seoDescription) fd.append('seoDescription', form.seoDescription)
      // files: backend expects field name 'productImages' (uploadProductImages)
      imageFiles.forEach(file => fd.append('productImages', file))

      await axios.post('/api/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product created successfully')
      setShowAddModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      await axios.delete(`/api/admin/products/${productId}`)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/products/${productId}/status`, {
        isActive: !currentStatus
      })
      toast.success('Product status updated')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update product status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Products Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your product catalog and inventory
            </p>
          </div>
          
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by adding your first product
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                              <img
                                src={product.images?.[0] || '/api/placeholder/64/64'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                {(product.averageRating || 0).toFixed ? product.averageRating.toFixed(1) : (product.averageRating || 0)} ({product.totalReviews || 0} reviews)
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{product.price}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {product.stock}
                          </div>
                          {product.stock < 10 && (
                            <div className="text-xs text-red-500">Low stock</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(product._id, product.isActive)}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
              <motion.div
                className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl mx-4"
                initial={{ y: 40, scale: 0.98, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 20, scale: 0.98, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Add New Product</h2>
                  <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => setShowAddModal(false)}>
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">SKU</label>
                      <Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value.toUpperCase() })} placeholder="e.g. HH-PURE-200" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {['Pure 4 Suta','Refined 5 Suta','Reserved 6 Suta','Elite 6 Suta'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Size</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                        {['12-16mm','16-18mm','18-22mm'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pack Size</label>
                      <Input value={form.packSize} onChange={e => setForm({ ...form, packSize: e.target.value })} placeholder="e.g. 200g" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹)</label>
                      <Input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount Price (₹)</label>
                      <Input type="number" min="0" step="0.01" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Inventory</label>
                      <Input type="number" min="0" value={form.inventory} onChange={e => setForm({ ...form, inventory: Number(e.target.value) })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Weight (g)</label>
                      <Input type="number" min="0" value={form.weight} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Images</label>
                      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="block w-full text-sm" />
                      {imagePreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {imagePreviews.map((src, idx) => (
                            <div key={src} className="relative group">
                              <img src={src} alt={`preview-${idx}`} className="w-full h-20 object-cover rounded-md border" />
                              <button
                                type="button"
                                onClick={() => removeImageAt(idx)}
                                className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
                                aria-label="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
                      <Input value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} placeholder="e.g. red, blue" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                      <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. healthy, snack" />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-5">
                        <label className="block text-sm font-medium mb-2">Nutrition Info</label>
                      </div>
                      {['protein','carbs','fat','fiber','calories'].map(k => (
                        <div key={k}>
                          <label className="block text-xs mb-1 capitalize">{k}</label>
                          <Input value={form.nutritionInfo[k]} onChange={e => handleNutritionChange(k, e.target.value)} placeholder={k === 'calories' ? 'kcal' : 'g'} />
                        </div>
                      ))}
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium mb-2">Dimensions (cm)</label>
                      </div>
                      {['length','width','height'].map(k => (
                        <div key={k}>
                          <label className="block text-xs mb-1 capitalize">{k}</label>
                          <Input type="number" min="0" value={form.dimensions[k]} onChange={e => handleDimensionsChange(k, e.target.value)} />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 md:col-span-2">
                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                        <span className="text-sm">Active</span>
                      </label>
                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                        <span className="text-sm">Featured</span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">SEO Title</label>
                      <Input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">SEO Description</label>
                      <Input value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">SEO Keywords (comma separated)</label>
                      <Input value={form.seoKeywords} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); }} disabled={submitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Save Product'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminProducts
