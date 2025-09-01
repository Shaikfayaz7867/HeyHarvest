import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  Plus, 
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  Award,
  MessageSquare
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  // Review form state
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [eligibleOrders, setEligibleOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState('')

  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`)
      setProduct(response.data.product)
      
      // Fetch reviews
      const reviewsResponse = await axios.get(`/api/reviews/product/${id}`)
      setReviews(reviewsResponse.data.reviews)
      
      // Fetch related products
      if (response.data.product.category) {
        const relatedResponse = await axios.get(`/api/products?category=${response.data.product.category._id}&limit=4`)
        setRelatedProducts(relatedResponse.data.products.filter(p => p._id !== id))
      }
    } catch (error) {
      toast.error('Failed to fetch product details')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's delivered orders containing this product to determine review eligibility
  useEffect(() => {
    const fetchEligibility = async () => {
      if (!isAuthenticated || !id) return
      try {
        const res = await axios.get('/api/orders?limit=50')
        const orders = res.data?.orders || []
        const deliveredContainingProduct = orders.filter(o => 
          o.orderStatus === 'delivered' && Array.isArray(o.items) && o.items.some(it => String(it.productId?._id || it.productId) === String(id))
        )
        setEligibleOrders(deliveredContainingProduct)
        if (deliveredContainingProduct.length > 0) {
          // Store MongoDB _id for backend validation; display human-friendly orderId in UI
          setSelectedOrderId(deliveredContainingProduct[0]._id)
        } else {
          setSelectedOrderId('')
        }
      } catch (e) {
        // Silently ignore, not critical for viewing product
      }
    }
    fetchEligibility()
  }, [isAuthenticated, id])

  const alreadyReviewed = isAuthenticated && reviews.some(r => String(r.userId?._id) === String(user?._id))

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    setImages(files.slice(0, 3))
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to write a review')
      return
    }
    if (!selectedOrderId) {
      toast.error('You can only review after your order is delivered')
      return
    }
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating')
      return
    }
    if (title.trim().length < 5 || comment.trim().length < 10) {
      toast.error('Please provide a detailed title and comment')
      return
    }
    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('productId', id)
      // Backend expects Order _id for validation
      formData.append('orderId', selectedOrderId)
      formData.append('rating', String(rating))
      formData.append('title', title.trim())
      formData.append('comment', comment.trim())
      images.forEach((file) => formData.append('images', file))

      await axios.post('/api/reviews/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Review submitted!')
      // Reset form
      setRating(0)
      setTitle('')
      setComment('')
      setImages([])
      // Refresh reviews
      const reviewsResponse = await axios.get(`/api/reviews/product/${id}`)
      setReviews(reviewsResponse.data.reviews)
      // Refresh product to update averageRating and totalReviews
      const productRes = await axios.get(`/api/products/${id}`)
      setProduct(productRes.data.product)
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ]

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category?._id}`} className="hover:text-primary">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-white">
              <img
                src={product.images?.[selectedImage] || '/api/placeholder/600/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {product.shortDescription}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'text-accent fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.averageRating?.toFixed(1)} ({product.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.salePrice || product.price}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
                {product.discountPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.discountPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Weight: {product.weight} | SKU: {product.sku}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.inventory > 10 ? 'bg-green-500' : 
                product.inventory > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {product.inventory > 10 ? 'In Stock' : 
                 product.inventory > 0 ? `Only ${product.inventory} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[3rem]">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                      disabled={quantity >= product.inventory}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Max: {product.inventory}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.inventory === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Free Shipping</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Above ₹500</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">7-Day Return</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Easy Returns</p>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Premium Quality</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Guaranteed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <Card>
            <CardContent className="p-8">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  
                  {product.benefits && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Health Benefits</h3>
                      <ul className="space-y-2">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Weight</span>
                        <span className="font-medium">{product.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category</span>
                        <span className="font-medium">{product.category?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">SKU</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Shelf Life</span>
                        <span className="font-medium">{product.shelfLife || '12 months'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Nutritional Info</h3>
                    <div className="space-y-3">
                      {product.nutritionalInfo ? (
                        Object.entries(product.nutritionalInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          Nutritional information coming soon
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Write a Review */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                    {!isAuthenticated ? (
                      <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-300 mb-2">Please login to write a review.</p>
                        <Link to="/login"><Button size="sm">Login</Button></Link>
                      </div>
                    ) : alreadyReviewed ? (
                      <p className="text-gray-700 dark:text-gray-300">You have already reviewed this product.</p>
                    ) : eligibleOrders.length === 0 ? (
                      <p className="text-gray-700 dark:text-gray-300">You can review this product once your order is delivered.</p>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Your Rating</label>
                          <div className="flex items-center space-x-1">
                            {[1,2,3,4,5].map((i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setRating(i)}
                                className="focus:outline-none"
                                aria-label={`Rate ${i} star${i>1?'s':''}`}
                              >
                                <Star className={`h-6 w-6 ${i <= rating ? 'text-accent fill-current' : 'text-gray-300'}`} />
                              </button>
                            ))}

                          </div>
                        </div>

                        {eligibleOrders.length > 1 && (
                          <div>
                            <label className="block text-sm font-medium mb-1">Select Delivered Order</label>
                            <select
                              value={selectedOrderId}
                              onChange={(e) => setSelectedOrderId(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                            >
                              {eligibleOrders.map(o => (
                                <option key={o._id} value={o._id}>
                                  {o.orderId} • {new Date(o.deliveredAt || o.createdAt).toLocaleDateString()}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                            placeholder="Summarize your review"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Comment</label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                            placeholder="Share details of your experience"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Add Photos (optional)</label>
                          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                          {images.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{images.length} file(s) selected</p>
                          )}
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={submitting || rating === 0 || !selectedOrderId}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Be the first to review this product!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">
                                  {review.userId?.firstName} {review.userId?.lastName}
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'text-accent fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct._id} className="overflow-hidden card-hover">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.images?.[0] || '/api/placeholder/300/300'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-1">{relatedProduct.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{relatedProduct.price}
                      </span>
                      {relatedProduct.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{relatedProduct.discountPrice}
                        </span>
                      )}
                    </div>
                    <Link to={`/products/${relatedProduct._id}`}>
                      <Button size="sm" className="w-full">
                        View Product
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
