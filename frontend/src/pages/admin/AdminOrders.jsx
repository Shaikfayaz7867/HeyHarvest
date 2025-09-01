import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const orderStatuses = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-purple-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-orange-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, searchTerm, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/orders', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: statusFilter,
          limit: 10
        }
      })
      setOrders(response.data.orders)
      setTotalPages(response.data.pagination?.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus
      })
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleExportOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders/export', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Orders exported successfully')
    } catch (error) {
      toast.error('Failed to export orders')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Orders Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage customer orders
            </p>
          </div>
          
          <Button onClick={handleExportOrders}>
            <Download className="mr-2 h-4 w-4" />
            Export Orders
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
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders.length})</CardTitle>
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
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Orders will appear here once customers start placing them
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              #{order.orderId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.paymentMethod}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {order.items?.length} items
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items?.reduce((sum, item) => sum + item.quantity, 0)} qty
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{order.subtotal?.toLocaleString()}
                          </div>
                          {(order.couponDiscount || order.discountAmount) > 0 && (
                            <div className="text-xs text-green-600">
                              -₹{(order.couponDiscount || order.discountAmount)} discount
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.orderStatus)}
                            <select
                              className={`px-2 py-1 text-xs font-medium rounded-full border-none ${getStatusColor(order.orderStatus)}`}
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            >
                              {orderStatuses.slice(1).map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
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

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Order Details - #{selectedOrder.orderId}</h2>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.userId?.firstName} {selectedOrder.userId?.lastName}</p>
                    <p><strong>Email:</strong> {selectedOrder.userId?.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.userId?.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="text-sm">
                    <p>{selectedOrder.shippingAddress?.addressLine1}{selectedOrder.shippingAddress?.addressLine2 ? `, ${selectedOrder.shippingAddress?.addressLine2}` : ''}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p>{selectedOrder.shippingAddress?.pincode}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.productId?.images?.[0] || '/api/placeholder/48/48'}
                          alt={item.productId?.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.productId?.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total: ₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                      Close
                    </Button>
                    <Button>
                      Print Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
