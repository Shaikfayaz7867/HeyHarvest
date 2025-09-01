import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  ArrowLeft,
  Tag
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const Cart = () => {
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const { 
    items, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    loading 
  } = useCart()
  
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const subtotal = items?.reduce((sum, item) => 
    sum + ((item.productId?.discountPrice || item.productId?.price || 0) * item.quantity), 0
  ) || 0

  const discount = appliedCoupon ? 
    (appliedCoupon.type === 'PERCENTAGE' ? 
      (subtotal * appliedCoupon.value / 100) : 
      appliedCoupon.value
    ) : 0

  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal - discount + shipping

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(productId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setCouponLoading(true)
    try {
      // This would typically call an API to validate the coupon
      // For now, we'll simulate a successful coupon application
      setAppliedCoupon({
        code: couponCode,
        type: 'PERCENTAGE',
        value: 10
      })
      toast.success('Coupon applied successfully!')
    } catch (error) {
      toast.error('Invalid coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!items?.length) {
    return (
      <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.productId?._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.productId?.images?.[0] || '/api/placeholder/80/80'}
                          alt={item.productId?.name || 'Product image'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{item.productId?.name}</h3>
                        {item.productId?.weight && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.productId.weight}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            ₹{item.productId?.discountPrice || item.productId?.price}
                          </span>
                          {item.productId?.discountPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.productId?.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId?._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 text-center min-w-[3rem]">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId?._id, item.quantity + 1)}
                            disabled={item.quantity >= (item.productId?.inventory ?? Infinity)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId?._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link to="/products">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Apply Coupon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">
                        {appliedCoupon.code} applied
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppliedCoupon(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      variant="outline"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">
                      🎉 Free shipping on orders above ₹500
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Secure checkout powered by Razorpay
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>7-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>100% quality guarantee</span>
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

export default Cart
