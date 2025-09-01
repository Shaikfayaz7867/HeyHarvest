import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  User,
  Building
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'GENERAL'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/contact', formData)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'GENERAL'
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: ["+91 98765 43210", "+91 87654 32109"],
      description: "Mon-Sat 9AM-7PM"
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: ["hello@heyharvest.com", "support@heyharvest.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Address",
      details: ["Hey Harvest Foods Pvt Ltd", "Patna, Bihar, India - 800001"],
      description: "Visit our office"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Business Hours",
      details: ["Monday - Saturday: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 5:00 PM"],
      description: "IST (Indian Standard Time)"
    }
  ]

  const inquiryTypes = [
    { value: 'GENERAL', label: 'General Inquiry' },
    { value: 'PRODUCT', label: 'Product Information' },
    { value: 'ORDER', label: 'Order Support' },
    { value: 'BULK', label: 'Bulk Purchase' },
    { value: 'PARTNERSHIP', label: 'Partnership' },
    { value: 'COMPLAINT', label: 'Complaint' }
  ]

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have questions about our premium makhana? We're here to help! 
            Reach out for product information, bulk orders, or any support you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="pl-10"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="pl-10"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="pl-10"
                          placeholder="Enter your phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Inquiry Type
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white dark:bg-gray-800"
                          value={formData.inquiryType}
                          onChange={handleChange}
                        >
                          {inquiryTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                    />
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
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-gray-600 dark:text-gray-400">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-primary mt-2">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Find Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Interactive map coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What is the minimum order quantity?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      There's no minimum order quantity for retail purchases. For bulk orders, please contact us for special pricing.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Do you ship pan-India?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Yes, we ship across India. Free shipping on orders above ₹500.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What's your return policy?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      We offer a 7-day return policy for unopened products in original packaging.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Are your products organic?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Yes, our makhana is naturally grown in pristine ponds without any chemicals or pesticides.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How long does shipping take?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Standard delivery takes 3-5 business days. Express delivery available in select cities.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Do you offer wholesale pricing?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Yes, we offer competitive wholesale pricing for bulk orders. Contact us for a quote.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
