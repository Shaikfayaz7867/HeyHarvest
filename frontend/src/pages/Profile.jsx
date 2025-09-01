import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Plus, 
  Trash2,
  Save,
  X,
  Lock
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [addressData, setAddressData] = useState({
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setAddresses(response.data?.user?.addresses || [])
    } catch (error) {
      console.error('Failed to fetch addresses')
    }
  }

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData)
      setEditingProfile(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleAddressSubmit = async () => {
    try {
      if (editingAddress) {
        await axios.put(`/api/auth/addresses/${editingAddress}`, addressData)
        toast.success('Address updated successfully!')
      } else {
        await axios.post('/api/auth/addresses', addressData)
        toast.success('Address added successfully!')
      }
      setEditingAddress(null)
      setAddressData({
        type: 'HOME',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      })
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`/api/auth/addresses/${addressId}`)
        toast.success('Address deleted successfully!')
        fetchAddresses()
      } catch (error) {
        toast.error('Failed to delete address')
      }
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setActiveTab('security')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'security', label: 'Security' },
    { id: 'change-password', label: 'Change Password' }
  ]

  return (
    <div className="min-h-screen bg-kraft dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProfile(!editingProfile)}
                >
                  {editingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {editingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    {editingProfile ? (
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{user?.firstName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    {editingProfile ? (
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{user?.lastName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user?.email}</span>
                      {user?.isEmailVerified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {editingProfile ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{user?.phone}</span>
                        {user?.isPhoneVerified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {editingProfile && (
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setEditingProfile(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleProfileUpdate}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Button
                  onClick={() => setEditingAddress('new')}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No addresses saved yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary">
                            {address.type}
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingAddress(address._id)
                                setAddressData(address)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state} {address.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add/Edit Address Form */}
            {editingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingAddress === 'new' ? 'Add New Address' : 'Edit Address'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <Input
                        value={addressData.fullName}
                        onChange={(e) => setAddressData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <Input
                        value={addressData.phone}
                        onChange={(e) => setAddressData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={addressData.type}
                        onChange={(e) => setAddressData(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pincode
                      </label>
                      <Input
                        value={addressData.pincode}
                        onChange={(e) => setAddressData(prev => ({ ...prev, pincode: e.target.value }))}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address Line 1
                    </label>
                    <Input
                      value={addressData.addressLine1}
                      onChange={(e) => setAddressData(prev => ({ ...prev, addressLine1: e.target.value }))}
                      placeholder="House no., Street, Area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <Input
                      value={addressData.addressLine2}
                      onChange={(e) => setAddressData(prev => ({ ...prev, addressLine2: e.target.value }))}
                      placeholder="Landmark, Apartment, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <Input
                        value={addressData.city}
                        onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <Input
                        value={addressData.state}
                        onChange={(e) => setAddressData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingAddress(null)
                        setAddressData({
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
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddressSubmit}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last updated 30 days ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('change-password')}>
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Login Sessions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your active sessions
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'change-password' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setActiveTab('security')}>
                    Cancel
                  </Button>
                  <Button onClick={handleChangePassword}>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Profile
