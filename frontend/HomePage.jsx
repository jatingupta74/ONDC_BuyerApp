import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const heroSlides = [
    {
      id: 1,
      title: "Discover Amazing Products",
      subtitle: "Shop from verified sellers across India",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Fresh Groceries Delivered",
      subtitle: "Get fresh produce delivered to your doorstep",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop",
      cta: "Order Fresh"
    },
    {
      id: 3,
      title: "Fashion & Electronics",
      subtitle: "Latest trends and cutting-edge technology",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Explore"
    }
  ]

  const categories = [
    {
      id: 'grocery',
      name: 'Grocery',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
      description: 'Fresh fruits, vegetables & daily essentials'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
      description: 'Trendy clothing & accessories'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
      description: 'Latest gadgets & appliances'
    },
    {
      id: 'home',
      name: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      description: 'Home decor & kitchen essentials'
    }
  ]

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Fast Delivery",
      description: "Quick delivery from local sellers"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure Shopping",
      description: "Safe and secure payment options"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Quality Products",
      description: "Verified sellers and quality products"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Round the clock customer support"
    }
  ]

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // Mock data for development
        const mockProducts = [
          {
            id: 'prod_001',
            name: 'Fresh Organic Apples',
            price: 150,
            images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'],
            seller: { name: 'Fresh Farm Store', rating: 4.5 },
            rating: 4.5,
            reviews: 128
          },
          {
            id: 'prod_002',
            name: 'Basmati Rice 5kg',
            price: 450,
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
            seller: { name: 'Grain Mart', rating: 4.2 },
            rating: 4.2,
            reviews: 89
          },
          {
            id: 'prod_003',
            name: 'Wireless Headphones',
            price: 2999,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
            seller: { name: 'Tech World', rating: 4.7 },
            rating: 4.7,
            reviews: 256
          },
          {
            id: 'prod_004',
            name: 'Cotton T-Shirt',
            price: 599,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
            seller: { name: 'Fashion Hub', rating: 4.3 },
            rating: 4.3,
            reviews: 94
          }
        ]
        
        setFeaturedProducts(mockProducts)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    // Auto-slide hero carousel
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    {slide.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover products from verified sellers across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked products from our trusted sellers
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          by {product.seller.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ONDC Buyer?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of digital commerce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of satisfied customers shopping on the ONDC network
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Shopping Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

