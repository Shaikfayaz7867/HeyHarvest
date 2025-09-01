import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set axios default headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
      localStorage.setItem('token', state.token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [state.token])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get('/api/auth/profile')
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              token
            }
          })
        } catch (error) {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.post('/api/auth/login', { email, password })
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      })
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.post('/api/auth/register', userData)
      
      dispatch({ type: 'SET_LOADING', payload: false })
      toast.success('Registration successful! Please verify your phone number.')
      return { success: true, data: response.data }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const verifyOTP = async (userId, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { userId, otp })
      
      // If backend returns token, log user in immediately
      if (response.data.token) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data
        })
      }
      
      toast.success('Phone number verified successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const resendOTP = async (userId) => {
    try {
      await axios.post('/api/auth/resend-otp', { userId })
      toast.success('OTP sent successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully!')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData)
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user
      })
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
      return { success: false, message }
    }
  }

  const addAddress = async (addressData) => {
    try {
      const response = await axios.post('/api/auth/addresses', addressData)
      dispatch({
        type: 'UPDATE_USER',
        payload: { addresses: response.data.addresses }
      })
      toast.success('Address added successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add address'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    ...state,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateProfile,
    addAddress
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
