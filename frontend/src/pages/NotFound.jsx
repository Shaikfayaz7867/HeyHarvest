import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="text-8xl md:text-9xl font-bold text-primary/20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Oops! The page you're looking for seems to have wandered off like a lotus seed in the wind.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Maybe you're looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/products">
              <Button variant="ghost" size="sm">Our Products</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="sm">About Us</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm">Contact</Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="sm">Blog</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
