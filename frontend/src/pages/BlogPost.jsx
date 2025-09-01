import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Heart,
  Tag,
  Eye
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/blog/${slug}`)
      setPost(response.data.post)
      
      // Fetch related posts
      if (response.data.post.category) {
        const relatedResponse = await axios.get(`/api/blog?category=${response.data.post.category}&limit=3`)
        setRelatedPosts(relatedResponse.data.posts.filter(p => p._id !== response.data.post._id))
      }
    } catch (error) {
      toast.error('Failed to fetch blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {post.category}
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime || '5'} min read</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                  <img
                    src={post.author?.avatar || '/api/placeholder/40/40'}
                    alt={`${post.author?.firstName} ${post.author?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {post.author?.firstName} {post.author?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Author
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Enjoyed this article?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share it with your friends and family!
                </p>
              </div>
              <Button onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Article
              </Button>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost._id} className="overflow-hidden card-hover">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.featuredImage || '/api/placeholder/400/200'}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <Button variant="ghost" size="sm">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
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

export default BlogPost
