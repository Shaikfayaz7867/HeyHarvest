import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin,
  Calendar,
  CreditCard,
  Download,
  MessageSquare
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const OrderDetail = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`)
      setOrder(response.data.order)
    } catch (error) {
      toast.error('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', icon: <Package className="h-4 w-4" /> },
      { status: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" /> },
      { status: 'PROCESSING', label: 'Processing', icon: <Clock className="h-4 w-4" /> },
      { status: 'SHIPPED', label: 'Shipped', icon: <Truck className="h-4 w-4" /> },
      { status: 'DELIVERED', label: 'Delivered', icon: <CheckCircle className="h-4 w-4" /> }
    ]

    const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const currentIndex = statusOrder.indexOf((currentStatus || '').toUpperCase())

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link to="/orders">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps(order.orderStatus)

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/orders" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Order #{order.orderId}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-primary border-primary text-white' 
                          : step.active
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          step.completed || step.active 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {step.completed && order.statusHistory && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(order.statusHistory.find(h => (h.status || '').toUpperCase() === step.status)?.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-px h-8 ${
                          step.completed ? 'bg-primary' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Tracking Number
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 font-mono">
                          {order.trackingNumber}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.productId?.images?.[0] || '/api/placeholder/64/64'}
                          alt={item.productId?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productId?.name}</h4>
                        <p className="text-sm">
                          Quantity: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Payment & Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.couponDiscount}</span>
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
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span>Payment Method: {order.paymentMethod?.toUpperCase()}</span>
                  </div>
                  <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    (order.paymentStatus || '').toLowerCase() === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(order.paymentStatus || '').toUpperCase()}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">{order.shippingAddress.type}</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.pincode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
                {(order.orderStatus || '').toUpperCase() === 'DELIVERED' && (
                  <Button variant="outline" className="w-full">
                    Return/Exchange
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Reorder Items
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
