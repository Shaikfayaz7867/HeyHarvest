import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0
      }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, user } = useAuth()

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart()
    } else {
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [isAuthenticated, user])

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.get('/api/cart')
      dispatch({ type: 'SET_CART', payload: response.data.cart })
    } catch (error) {
      console.error('Fetch cart error:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return { success: false }
    }

    try {
      const response = await axios.post('/api/cart/add', { productId, quantity })
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      toast.success('Item added to cart!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart'
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.put('/api/cart/update', { productId, quantity })
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart'
      toast.error(message)
      return { success: false, message }
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${productId}`)
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      toast.success('Item removed from cart')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item'
      toast.error(message)
      return { success: false, message }
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear')
      dispatch({ type: 'CLEAR_CART' })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
