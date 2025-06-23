import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user and token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('ondc-token');
    if (token) {
      // You might want to verify the token with the backend here
      // For now, just fetch user profile if token exists
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser({ ...userData, token }); // Store token with user data
        localStorage.setItem('ondc-user', JSON.stringify({ ...userData, token }));
      } else {
        // Token might be invalid or expired
        localStorage.removeItem('ondc-token');
        localStorage.removeItem('ondc-user');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('ondc-token');
      localStorage.removeItem('ondc-user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('ondc-token', data.access_token);
        await fetchUserProfile(data.access_token); // Fetch profile after login
        return { success: true };
      } else {
        return { success: false, error: data.msg || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.msg };
      } else {
        return { success: false, error: data.msg || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ondc-token');
    localStorage.removeItem('ondc-user');
    localStorage.removeItem('ondc-cart'); // Keep cart removal if needed
  };

  // Save user to localStorage whenever it changes (excluding token if already stored separately)
  useEffect(() => {
    if (user) {
      const { token, ...userDataToStore } = user; // Exclude token before saving to oidc-user
      localStorage.setItem('ondc-user', JSON.stringify(userDataToStore));
    } else {
      localStorage.removeItem('ondc-user');
    }
  }, [user]);

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

