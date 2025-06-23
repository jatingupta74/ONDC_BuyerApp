import { Card, CardContent } from '@/components/ui/card'

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Checkout Page</h2>
            <p className="text-gray-600">This page will contain the checkout process including address selection, payment options, and order confirmation.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CheckoutPage

