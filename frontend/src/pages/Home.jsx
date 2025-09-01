import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Star,
  Shield,
  Truck,
  Heart,
  Leaf,
  Award,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useCart } from '../contexts/CartContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Home = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "100% Natural",
      description: "Sourced from pristine Mithilanchal ponds"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Premium Quality",
      description: "Hand-picked and carefully processed"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "GI Heritage",
      description: "Authentic Bihar makhana tradition"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Health First",
      description: "High protein, gluten-free superfood"
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: 1, limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })
        const res = await axios.get(`/api/products?${params}`)
        setProducts(res.data.products || [])
      } catch (e) {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart(productId, quantity)
      toast.success('Added to cart!')
    } catch (e) {
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0)
                        ? 'text-accent fill-current'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.totalReviews || 0})</span>
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
                disabled={product.inventory === 0}
                className="flex items-center space-x-1"
              >
                <span>{product.inventory === 0 ? 'Out of Stock' : 'Add'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background (light/dark) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Light mode blobs */}
          <motion.div
            className="absolute -inset-32 opacity-60 dark:hidden"
            style={{
              background:
                'radial-gradient(40% 40% at 30% 30%, rgba(253, 230, 138, 0.5) 0%, transparent 60%),\
                 radial-gradient(35% 35% at 80% 20%, rgba(167, 243, 208, 0.45) 0%, transparent 60%),\
                 radial-gradient(45% 45% at 50% 80%, rgba(251, 207, 232, 0.45) 0%, transparent 60%)'
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          />
          {/* Dark mode blobs */}
          <motion.div
            className="absolute -inset-32 opacity-50 hidden dark:block"
            style={{
              background:
                'radial-gradient(40% 40% at 30% 30%, rgba(75,85,99,0.35) 0%, transparent 60%),\
                 radial-gradient(35% 35% at 80% 20%, rgba(5,150,105,0.25) 0%, transparent 60%),\
                 radial-gradient(45% 45% at 50% 80%, rgba(14,165,233,0.25) 0%, transparent 60%)'
            }}
            animate={{ rotate: [0, -360] }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  className="text-4xl md:text-6xl font-heading font-bold text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Say Hey to{' '}
                  <span className="text-gradient">Health</span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Premium makhana from the pristine ponds of Mithilanchal, Bihar.
                  Rich in protein, antioxidants, and natural goodness.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Bulk Enquiry
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center space-x-6 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-accent fill-current" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span>10,000+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Free Shipping</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 aspect-[4/3] md:aspect-[5/4] lg:aspect-[4/3] xl:aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/public/Makhana.png"
                  alt="Premium Makhana Products"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Hey Harvest?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From pond to pack, we ensure every step meets the highest standards of quality and purity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 card-hover">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Our Premium Collection
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our range of premium makhana varieties, each carefully graded for size and quality.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <Star className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
                  Mithilanchal Heritage
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  For centuries, the fertile ponds of Mithilanchal in Bihar have been home to the finest makhana.
                  Our farmers continue this ancient tradition, harvesting lotus seeds with the same care and
                  dedication passed down through generations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Traditional Harvesting</h4>
                    <p className="text-gray-600 dark:text-gray-400">Hand-picked from natural ponds using traditional methods</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sun-Dried Processing</h4>
                    <p className="text-gray-600 dark:text-gray-400">Naturally dried under the Bihar sun for optimal nutrition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Export Quality</h4>
                    <p className="text-gray-600 dark:text-gray-400">Meeting international standards for global markets</p>
                  </div>
                </div>
              </div>

              <Link to="/about">
                <Button variant="outline">
                  Learn Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/api/placeholder/600/400"
                alt="Mithilanchal Heritage"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-brand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Ready to Experience Premium Makhana?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made the healthy choice.
              Order now and taste the difference quality makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="golden" size="lg" className="w-full sm:w-auto">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
