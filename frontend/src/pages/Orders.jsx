import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Eye,
  Calendar,
  MapPin
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await axios.get(`/api/orders${params}`)
      setOrders(response.data.orders)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-purple-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track and manage your order history
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filterOption) => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.id)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet"
                : `No orders with status: ${filter}`
              }
            </p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          Order #{order.orderId}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{(order.orderStatus || '').toUpperCase()}</span>
                        </div>
                        <Link to={`/orders/${order.orderId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Items Preview */}
                      <div>
                        <h4 className="font-medium mb-3">Items</h4>
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item._id} className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item.productId?.images?.[0] || '/api/placeholder/48/48'}
                                  alt={item.productId?.name || 'Product'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1">
                                  {item.productId?.name || 'Product'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-medium mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>-₹{order.couponDiscount || order.discountAmount || 0}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{order.shippingCharges}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹{order.taxAmount}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                              <div className="text-sm">
                                <p className="font-medium">Delivery Address</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}, {order.shippingAddress.city}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t flex justify-between items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {order.trackingNumber && (
                          <span>Tracking: {order.trackingNumber}</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {(order.orderStatus || '').toLowerCase() === 'pending' && (
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            Cancel Order
                          </Button>
                        )}
                        {(order.orderStatus || '').toLowerCase() === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                        <Link to={`/orders/${order.orderId}`}>
                          <Button size="sm">
                            Track Order
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
