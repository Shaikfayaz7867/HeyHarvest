import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
    salesData: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const navigate = useNavigate()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/admin/analytics?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue?.toLocaleString() || 0}`,
      change: "+12.5%",
      changeType: "increase",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders?.toLocaleString() || 0,
      change: "+8.2%",
      changeType: "increase",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "Total Customers",
      value: analytics.totalCustomers?.toLocaleString() || 0,
      change: "+15.3%",
      changeType: "increase",
      icon: <Users className="h-6 w-6" />,
      color: "text-purple-600"
    },
    {
      title: "Total Products",
      value: analytics.totalProducts?.toLocaleString() || 0,
      change: "+2.1%",
      changeType: "increase",
      icon: <Package className="h-6 w-6" />,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
               border-gray-300 focus:ring-primary 
               dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 
               dark:focus:ring-primary"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/admin/products')}>
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Add Product</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/admin/orders')}>
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm">View Orders</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/admin/customers')}>
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/admin/reports')}>
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-1">
                        {stat.changeType === 'increase' ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : analytics.recentOrders?.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No recent orders</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.recentOrders?.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.customer?.firstName} {order.customer?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ₹{order.total}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Selling Products</CardTitle>
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : analytics.topProducts?.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No sales data</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.topProducts?.slice(0, 5).map((product, index) => (
                      <div key={product._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.images?.[0] || '/api/placeholder/48/48'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.salesCount} sold
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ₹{product.revenue?.toLocaleString()}
                          </p>
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <span className="w-4 h-4 bg-primary rounded-full text-white text-center leading-4 mr-1">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sales Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Sales chart will be implemented with Chart.js
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
