import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '../context/CartContext'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  
  const { addToCart } = useCart()

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'grocery', name: 'Grocery' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'home', name: 'Home & Kitchen' }
  ]

  const mockProducts = [
    {
      id: 'prod_001',
      name: 'Fresh Organic Apples',
      description: 'Premium quality organic apples, freshly harvested',
      price: 150,
      category: 'grocery',
      images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'],
      seller: { id: 'seller_001', name: 'Fresh Farm Store', rating: 4.5 },
      rating: 4.5,
      reviews: 128,
      availability: true,
      delivery_time: '2-4 hours'
    },
    {
      id: 'prod_002',
      name: 'Basmati Rice 5kg',
      description: 'Premium quality basmati rice, aged for perfect aroma',
      price: 450,
      category: 'grocery',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
      seller: { id: 'seller_002', name: 'Grain Mart', rating: 4.2 },
      rating: 4.2,
      reviews: 89,
      availability: true,
      delivery_time: '4-6 hours'
    },
    {
      id: 'prod_003',
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 2999,
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      seller: { id: 'seller_003', name: 'Tech World', rating: 4.7 },
      rating: 4.7,
      reviews: 256,
      availability: true,
      delivery_time: '1-2 days'
    },
    {
      id: 'prod_004',
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt in various colors',
      price: 599,
      category: 'fashion',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      seller: { id: 'seller_004', name: 'Fashion Hub', rating: 4.3 },
      rating: 4.3,
      reviews: 94,
      availability: true,
      delivery_time: '2-3 days'
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        let filteredProducts = [...mockProducts]
        
        // Filter by search query
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        // Filter by category
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
          )
        }
        
        // Filter by price range
        if (priceRange.min) {
          filteredProducts = filteredProducts.filter(product =>
            product.price >= parseFloat(priceRange.min)
          )
        }
        if (priceRange.max) {
          filteredProducts = filteredProducts.filter(product =>
            product.price <= parseFloat(priceRange.max)
          )
        }
        
        // Sort products
        switch (sortBy) {
          case 'price_low':
            filteredProducts.sort((a, b) => a.price - b.price)
            break
          case 'price_high':
            filteredProducts.sort((a, b) => b.price - a.price)
            break
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating)
            break
          default:
            // Keep original order for relevance
            break
        }
        
        setProducts(filteredProducts)
        setIsLoading(false)
      }, 500)
    }

    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    setSearchParams(params)
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="₹0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="₹10000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
          </h1>
          <span className="text-gray-600">
            {isLoading ? 'Loading...' : `${products.length} products found`}
          </span>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-300" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse our categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <Link to={`/products/${product.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.availability && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <CardContent className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.delivery_time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      by {product.seller.name}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.availability}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage

