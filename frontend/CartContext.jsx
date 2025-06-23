import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0
      }
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      } else {
        const newItems = [...state.items, action.payload]
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload.id)
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }
    
    default:
      return state
  }
}

const initialState = {
  items: [],
  total: 0,
  itemCount: 0
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ondc-cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: 'SET_CART', payload: cartData })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ondc-cart', JSON.stringify(state))
  }, [state])

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        sellerId: product.seller?.id,
        sellerName: product.seller?.name,
        quantity
      }
    })
  }

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: itemId, quantity }
    })
  }

  const removeFromCart = (itemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id: itemId }
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartSummary = () => {
    const sellers = {}
    
    state.items.forEach(item => {
      if (!sellers[item.sellerId]) {
        sellers[item.sellerId] = {
          id: item.sellerId,
          name: item.sellerName,
          items: [],
          subtotal: 0
        }
      }
      sellers[item.sellerId].items.push(item)
      sellers[item.sellerId].subtotal += item.price * item.quantity
    })

    const deliveryCharges = Object.keys(sellers).length * 50 // ₹50 per seller
    const taxes = state.total * 0.18 // 18% GST
    const finalTotal = state.total + deliveryCharges + taxes

    return {
      sellers: Object.values(sellers),
      subtotal: state.total,
      deliveryCharges,
      taxes,
      finalTotal,
      itemCount: state.itemCount
    }
  }

  const value = {
    cartItems: state.items,
    cartTotal: state.total,
    cartItemCount: state.itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSummary
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

