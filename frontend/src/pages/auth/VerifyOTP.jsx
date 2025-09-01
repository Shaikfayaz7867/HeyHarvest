import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Leaf } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)

  const { verifyOTP, resendOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const phone = location.state?.phone

  useEffect(() => {
    if (!userId) {
      navigate('/register')
      return
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [userId, navigate])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP')
      return
    }

    setLoading(true)

    const result = await verifyOTP(userId, otpString)
    setLoading(false)
    
    if (result.success) {
      navigate('/')
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    const result = await resendOTP(userId)
    setResendLoading(false)
    
    if (result.success) {
      setTimer(60)
      setOtp(['', '', '', '', '', ''])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kraft via-white to-kraft flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Brand Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mb-4"
          >
            <Leaf className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold text-gray-900">
            Verify Your Phone
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to <strong>{phone}</strong>
          </p>
        </div>

        {/* OTP Form */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Enter OTP</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg font-semibold"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend OTP in <span className="font-semibold text-primary">{timer}s</span>
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-primary hover:text-primary/80"
                >
                  {resendLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              )}
            </div>

            <div className="mt-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Registration
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-blue-800 mb-2">Didn't receive the code?</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Check your phone for SMS messages</li>
            <li>• Make sure the phone number is correct</li>
            <li>• Wait a few minutes for the SMS to arrive</li>
            <li>• Click "Resend OTP" if the timer expires</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VerifyOTP
