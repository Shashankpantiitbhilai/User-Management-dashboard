import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ArrowLeft, Mail, Building2, User as UserIcon, AlertCircle } from 'lucide-react';

export function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();

        // Transform the data to match our schema
        const transformedUser: User = {
          id: data.id,
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ')[1] || '',
          email: data.email,
          department: data.company.name,
        };

        setUser(transformedUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="text-lg text-gray-600">Loading user profile...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 text-center mb-6">{error || 'User not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <button
            onClick={() => navigate('/')}
            className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-2xl font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
              </div>

              <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">
                User Profile
              </h1>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <UserIcon className="h-6 w-6 text-indigo-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Full Name</div>
                    <div className="text-lg text-gray-900">{user.firstName} {user.lastName}</div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-6 w-6 text-indigo-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div className="text-lg text-gray-900">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-indigo-500 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Department</div>
                    <div className="text-lg text-gray-900">{user.department}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}