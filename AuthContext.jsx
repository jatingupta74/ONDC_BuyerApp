import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ondc-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        localStorage.removeItem('ondc-user')
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('ondc-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('ondc-user')
    }
  }, [user])

  const login = async (email, password) => {
    try {
      // Mock login - in production, this would call your API
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
        phone: '+91 9876543210',
        addresses: [
          {
            id: '1',
            type: 'home',
            name: 'John Doe',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            addressLine2: 'Apartment 4B',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            isDefault: true
          }
        ],
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false
        }
      }

      setUser(mockUser)
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      // Mock registration - in production, this would call your API
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        addresses: [],
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false
        }
      }

      setUser(newUser)
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ondc-user')
    localStorage.removeItem('ondc-cart')
  }

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Profile update failed' }
    }
  }

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now().toString()
    }
    
    const updatedUser = {
      ...user,
      addresses: [...(user.addresses || []), newAddress]
    }
    
    setUser(updatedUser)
    return newAddress
  }

  const updateAddress = (addressId, updatedAddress) => {
    const updatedUser = {
      ...user,
      addresses: user.addresses.map(addr =>
        addr.id === addressId ? { ...addr, ...updatedAddress } : addr
      )
    }
    
    setUser(updatedUser)
  }

  const deleteAddress = (addressId) => {
    const updatedUser = {
      ...user,
      addresses: user.addresses.filter(addr => addr.id !== addressId)
    }
    
    setUser(updatedUser)
  }

  const setDefaultAddress = (addressId) => {
    const updatedUser = {
      ...user,
      addresses: user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    }
    
    setUser(updatedUser)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isAuthenticated: !!user
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

