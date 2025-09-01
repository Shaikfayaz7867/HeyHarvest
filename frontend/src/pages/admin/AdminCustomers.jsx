import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Mail,
  Phone,
  MapPin,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const statusOptions = [
    { value: '', label: 'All Customers' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'blocked', label: 'Blocked' }
  ]

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchTerm, statusFilter])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/customers', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: statusFilter,
          limit: 10
        }
      })
      setCustomers(response.data.customers)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCustomerStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    try {
      await axios.patch(`/api/admin/customers/${customerId}/status`, {
        status: newStatus
      })
      toast.success(`Customer ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`)
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to update customer status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-500" />
      case 'blocked':
        return <UserX className="h-4 w-4 text-red-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Customer Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage customer accounts and relationships
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    New This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.filter(c => {
                      const createdDate = new Date(c.createdAt)
                      const now = new Date()
                      return createdDate.getMonth() === now.getMonth() && 
                             createdDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Blocked Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.filter(c => c.status === 'blocked').length}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
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
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({customers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No customers found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Customers will appear here once they register
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {customers.map((customer) => (
                      <motion.tr
                        key={customer._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                              <span className="text-sm font-medium text-primary">
                                {customer.firstName?.[0]}{customer.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {customer._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {customer.orderCount || 0} orders
                          </div>
                          <div className="text-sm text-gray-500">
                            Last: {customer.lastOrderDate ? 
                              new Date(customer.lastOrderDate).toLocaleDateString() : 
                              'Never'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{customer.totalSpent?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-500">
                            Avg: ₹{customer.avgOrderValue?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(customer.status)}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                              {customer.status || 'active'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.floor((new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleCustomerStatus(customer._id, customer.status)}
                              className={customer.status === 'blocked' ? 'text-green-600' : 'text-red-600'}
                            >
                              {customer.status === 'blocked' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
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

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Customer Details - {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h2>
                <Button variant="ghost" onClick={() => setSelectedCustomer(null)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Phone:</strong> {selectedCustomer.phone || 'Not provided'}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                        {selectedCustomer.status || 'active'}
                      </span>
                    </p>
                    <p><strong>Joined:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Order Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Total Orders:</strong> {selectedCustomer.orderCount || 0}</p>
                    <p><strong>Total Spent:</strong> ₹{selectedCustomer.totalSpent?.toLocaleString() || 0}</p>
                    <p><strong>Average Order:</strong> ₹{selectedCustomer.avgOrderValue?.toLocaleString() || 0}</p>
                    <p><strong>Last Order:</strong> {selectedCustomer.lastOrderDate ? 
                      new Date(selectedCustomer.lastOrderDate).toLocaleDateString() : 
                      'Never'
                    }</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Addresses</h3>
                {selectedCustomer.addresses?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.addresses.map((address, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                          <div className="text-sm">
                            <p className="font-medium">{address.type || 'Address'}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No addresses saved</p>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                  Close
                </Button>
                <Button>
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCustomers
