import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthContext'; // Corrected path
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 p-8">
            <CardTitle className="text-3xl font-bold text-white text-center">
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-blue-600 mb-4">
                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
              <p className="text-md text-gray-500">{user.email}</p>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{user.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              {/* Add more profile fields as needed */}
            </div>

            <Button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              variant="destructive"
              className="w-full mt-6"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

