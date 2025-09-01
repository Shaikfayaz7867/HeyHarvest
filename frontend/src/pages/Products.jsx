import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [filters, pagination.page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice })
      })

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data.products)
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages
      }))
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart(productId, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const ProductCard = ({ product }) => {
    const [current, setCurrent] = useState(0)
    const images = (product.images && product.images.length > 0)
      ? product.images
      : ['/api/placeholder/300/300']

    const next = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrent((prev) => (prev + 1) % images.length)
    }

    const prev = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrent((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden card-hover group">
          <Link to={`/products/${product._id}`} className="block">
            <div className="relative aspect-square overflow-hidden">
              <motion.img
                key={current}
                src={images[current]}
                alt={product.name}
                initial={{ opacity: 0.4, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {images.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </button>
                </>
              )}
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  {product.discount}% OFF
                </div>
              )}
              <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </Link>

          <CardContent className="p-4 space-y-3">
            <div>
              <Link to={`/products/${product._id}`} className="block">
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0)
                      ? 'text-accent fill-current'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.totalReviews || 0})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    ₹{product.salePrice || product.price} {product.discountPrice && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </span>
                    )}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{Math.round(product.discountPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">{product.weight}g</p>
              </div>

              <Button
                size="sm"
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock === 0}
                className="flex items-center space-x-1"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover our premium collection of makhana varieties
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none 
               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
                          text-gray-400 dark:text-gray-300 pointer-events-none" />
            </div>


            {/* Price Range */}
            <div className="flex space-x-2">
              <Input
                placeholder="Min ₹"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <Input
                placeholder="Max ₹"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                className="w-full px-3 py-2 pr-8 
               border rounded-md 
               focus:outline-none focus:ring-2 focus:ring-primary 
               appearance-none
               bg-white text-gray-900 border-gray-300
               dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  handleFilterChange('sortBy', sortBy)
                  handleFilterChange('sortOrder', sortOrder)
                }}
              >
                <option value="" disabled>Sort by...</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="averageRating-desc">Rating High-Low</option>
                <option value="createdAt-desc">Newest First</option>
              </select>

              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 
               text-gray-400 dark:text-gray-300 pointer-events-none"
              />
            </div>


          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {products.length} of {pagination.total} products
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
            }`}>
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={pagination.page === page ? 'default' : 'outline'}
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                    >
                      {page}
                    </Button>
                  )
                } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                  return <span key={page} className="px-2">...</span>
                }
                return null
              })}

              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
