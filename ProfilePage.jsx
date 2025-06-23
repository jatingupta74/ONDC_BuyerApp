import { Card, CardContent } from '@/components/ui/card'

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Profile Page</h2>
            <p className="text-gray-600">This page will contain user profile information, address management, and account settings.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage

