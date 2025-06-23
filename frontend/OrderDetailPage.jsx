import { Card, CardContent } from '@/components/ui/card'

const OrderDetailPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Order Detail Page</h2>
            <p className="text-gray-600">This page will show detailed information about a specific order including items, tracking, and delivery status.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetailPage

