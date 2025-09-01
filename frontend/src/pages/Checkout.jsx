import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  MapPin, 
  Plus, 
  Check, 
  Lock,
  ArrowLeft,
  Package,
  Truck
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Checkout = () => {
  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY')
  const [orderNotes, setOrderNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  })

  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const subtotal = items?.reduce((sum, item) =>
    sum + ((item.productId?.discountPrice || item.productId?.price || 0) * item.quantity), 0
  ) || 0
  const shipping = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      const list = response.data?.user?.addresses || []
      setAddresses(list)
      if (list.length > 0) {
        setSelectedAddress(list.find(a => a.isDefault)?._id || list[0]._id)
      }
    } catch (error) {
      console.error('Failed to fetch addresses')
    }
  }

  const handleAddAddress = async () => {
    try {
      await axios.post('/api/auth/addresses', newAddress)
      toast.success('Address added successfully!')
      setShowAddressForm(false)
      setNewAddress({
        type: 'home',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
      })
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to add address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    setLoading(true)
    try {
      const selectedAddr = addresses.find(addr => addr._id === selectedAddress)
      const orderData = {
        shippingAddress: selectedAddr,
        billingAddress: selectedAddr,
        paymentMethod: paymentMethod === 'RAZORPAY' ? 'razorpay' : 'cod',
        couponCode: '',
        notes: orderNotes,
        // Fallback items for backend in case server cart appears empty
        items: (items || []).map(ci => ({
          productId: ci.productId?._id || ci.productId,
          quantity: ci.quantity || 1
        }))
      }

      const response = await axios.post('/api/orders/create', orderData)
      
      if (paymentMethod === 'RAZORPAY') {
        const publicKey = import.meta.env.VITE_RAZORPAY_KEY_ID
        if (!publicKey) {
          toast.error('Payment config error: VITE_RAZORPAY_KEY_ID is missing in frontend .env')
          setLoading(false)
          return
        }
        // Create Razorpay payment
        const paymentResponse = await axios.post('/api/payment/create-order', {
          orderId: response.data.orderId,
          amount: total
        })

        const options = {
          key: publicKey,
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency,
          name: 'Hey Harvest Foods',
          description: `Order #${response.data.orderId}`,
          order_id: paymentResponse.data.razorpayOrderId,
          handler: async (paymentResult) => {
            try {
              await axios.post('/api/payment/verify', {
                orderId: response.data.orderId,
                razorpayOrderId: paymentResult.razorpay_order_id,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature
              })
              
              clearCart()
              toast.success('Order placed successfully!')
              navigate(`/orders/${response.data.orderId}`)
            } catch (error) {
              toast.error('Payment verification failed')
            }
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.phone
          },
          theme: {
            color: '#2D5016'
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        // COD order
        clearCart()
        toast.success('Order placed successfully!')
        navigate(`/orders/${response.data.orderId}`)
      }
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Delivery Address', icon: <MapPin className="h-5 w-5" /> },
    { number: 2, title: 'Payment Method', icon: <CreditCard className="h-5 w-5" /> },
    { number: 3, title: 'Review Order', icon: <Package className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </button>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete your order in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto px-1">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step > stepItem.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepItem.icon
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= stepItem.number ? 'text-primary' : 'text-gray-400'
                }`}>
                  {stepItem.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-px ml-4 ${
                    step > stepItem.number ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Select Delivery Address</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === address._id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                              selectedAddress === address._id
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}>
                              {selectedAddress === address._id && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-primary text-sm">{address.type}</p>
                              <p className="text-gray-900 dark:text-white">{address.addressLine1}</p>
                              {address.addressLine2 && (
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{address.addressLine2}</p>
                              )}
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {address.city}, {address.state} {address.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {showAddressForm && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
                        <h4 className="font-medium">Add New Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <Input
                              value={newAddress.fullName}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <Input
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Address Type</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              value={newAddress.type}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Pincode</label>
                            <Input
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                              placeholder="Enter pincode"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Address Line 1</label>
                          <Input
                            value={newAddress.addressLine1}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                            placeholder="House no., Street, Area"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
                          <Input
                            value={newAddress.addressLine2}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                            placeholder="Landmark, Apartment, etc."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <Input
                              value={newAddress.city}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">State</label>
                            <Input
                              value={newAddress.state}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                              placeholder="Enter state"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddAddress}>
                            Save Address
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        disabled={!selectedAddress}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'RAZORPAY'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('RAZORPAY')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'RAZORPAY'
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'RAZORPAY' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-5 w-5 text-primary" />
                              <span className="font-medium">Online Payment</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay securely with UPI, Cards, Net Banking, or Wallets
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Lock className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-green-600">Secure</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'COD'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('COD')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'COD'
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'COD' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Package className="h-5 w-5 text-primary" />
                              <span className="font-medium">Cash on Delivery</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pay when your order is delivered
                            </p>
                          </div>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            +₹25 COD charges
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)}>
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Selected Address */}
                    <div>
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      {selectedAddress && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {(() => {
                            const address = addresses.find(a => a._id === selectedAddress)
                            return address ? (
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="text-sm">
                                  <p className="font-medium">{address.type}</p>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state} {address.pincode}
                                  </p>
                                </div>
                              </div>
                            ) : null
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {paymentMethod === 'RAZORPAY' ? (
                            <CreditCard className="h-4 w-4 text-primary" />
                          ) : (
                            <Package className="h-4 w-4 text-primary" />
                          )}
                          <span className="text-sm font-medium">
                            {paymentMethod === 'RAZORPAY' ? 'Online Payment' : 'Cash on Delivery'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows="3"
                        placeholder="Any special instructions for delivery..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        size="lg"
                        className="bg-gradient-brand hover:opacity-90"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Place Order - ₹{total + (paymentMethod === 'COD' ? 25 : 0)}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {items?.map((item, idx) => (
                    <div key={item.productId?._id || idx} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.productId?.images?.[0] || '/api/placeholder/48/48'}
                          alt={item.productId?.name || 'Product image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.productId?.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{((item.productId?.discountPrice || item.productId?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'COD' && (
                    <div className="flex justify-between">
                      <span>COD Charges</span>
                      <span>₹25</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total + (paymentMethod === 'COD' ? 25 : 0)}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                    <Lock className="h-3 w-3 text-green-500" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                    <Truck className="h-3 w-3 text-green-500" />
                    <span>Free shipping on orders above ₹500</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                    <Package className="h-3 w-3 text-green-500" />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
