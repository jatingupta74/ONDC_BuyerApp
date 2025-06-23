import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartSummary } = useCart()
  const summary = getCartSummary()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg">
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {summary.sellers.map((seller) => (
              <Card key={seller.id} className="overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h3 className="font-semibold text-gray-900">
                    Sold by {seller.name}
                  </h3>
                </div>
                <CardContent className="p-0">
                  {seller.items.map((item) => (
                    <div key={item.id} className="flex items-center p-6 border-b border-gray-100 last:border-b-0">
                      <div className="flex-shrink-0 w-20 h-20 mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          by {item.sellerName}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.price}
                          </span>
                          <div className="flex items-center space-x-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-sm text-gray-600">
                            Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Seller Subtotal */}
                  <div className="px-6 py-3 bg-gray-50 text-right">
                    <span className="font-semibold text-gray-900">
                      Seller Total: ₹{seller.subtotal.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({summary.itemCount})</span>
                    <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="font-medium">₹{summary.deliveryCharges.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">₹{summary.taxes.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{summary.finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Delivery Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Free delivery on orders above ₹500</li>
                    <li>• Estimated delivery: 2-4 hours</li>
                    <li>• Multiple sellers may have different delivery times</li>
                  </ul>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link to="/products" className="block mt-4">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mock recommended products */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Product {i}</h4>
                  <p className="text-lg font-bold text-gray-900">₹{(i * 100)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

