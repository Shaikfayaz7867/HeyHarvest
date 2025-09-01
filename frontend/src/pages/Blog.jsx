import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search,
  Tag,
  Clock
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [categories, setCategories] = useState(['health', 'recipes', 'farming', 'nutrition', 'lifestyle', 'news'])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchPosts()
    fetchFeaturedPosts()
  }, [pagination.page, searchTerm, selectedCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      })

      const response = await axios.get(`/api/blog?${params}`)
      const blogs = response.data.blogs || response.data.posts || []
      setPosts(blogs)
      // derive categories from blogs if any
      const derived = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))
      if (derived.length) setCategories(prev => Array.from(new Set([...prev, ...derived])))
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.totalBlogs ?? blogs.length,
        totalPages: response.data.pagination?.totalPages ?? 1
      }))
    } catch (error) {
      toast.error('Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const response = await axios.get('/api/blog/featured')
      setFeaturedPosts(response.data.blogs || response.data.posts || [])
    } catch (error) {
      console.error('Failed to fetch featured posts')
    }
  }

  // categories endpoint not present; using preset enum and deriving from fetched blogs

  const BlogCard = ({ post, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden card-hover h-full ${featured ? 'md:col-span-2' : ''}`}>
        <div className={`relative overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-video'}`}>
          <img
            src={post.featuredImage || '/api/placeholder/600/300'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            {featured && (
              <span className="inline-block bg-accent text-white px-2 py-1 rounded text-xs font-medium mb-2">
                Featured
              </span>
            )}
            <h3 className={`font-bold text-white line-clamp-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
              {post.title}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author?.firstName} {post.author?.lastName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime || '5'} min read</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
            {post.excerpt || post.content?.substring(0, 150) + '...'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {post.tags?.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            <Link to={`/blog/${post.slug}`}>
              <Button variant="ghost" size="sm">
                Read More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Hey Harvest Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the world of makhana, health tips, recipes, and stories from the farms of Bihar.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blog posts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white dark:bg-gray-800"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <BlogCard key={post._id} post={post} featured={index === 0} />
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Latest Posts
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
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

export default Blog
