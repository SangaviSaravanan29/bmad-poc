import React from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <div className="md:col-span-2">
                <div className="card h-full">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Welcome to TaskFlow!
                  </h3>
                  <p className="text-gray-600">
                    You have successfully authenticated and are now viewing the 
                    protected dashboard. This is the foundation for Epic 1 - 
                    User Authentication & Security.
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p>• Email: {user?.email}</p>
                    <p>• Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                    <p>• Status: Authenticated</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <div className="card h-full">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Authentication Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Session</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Secure
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email Verified</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Status */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Epic 1 Implementation Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                  <h4 className="font-medium text-gray-900">Supabase Integration</h4>
                  <p className="text-sm text-gray-600 mt-1">✅ Configured</p>
                </div>
                <div className="card">
                  <h4 className="font-medium text-gray-900">Auth Context</h4>
                  <p className="text-sm text-gray-600 mt-1">✅ Implemented</p>
                </div>
                <div className="card">
                  <h4 className="font-medium text-gray-900">Login Component</h4>
                  <p className="text-sm text-gray-600 mt-1">✅ Created</p>
                </div>
                <div className="card">
                  <h4 className="font-medium text-gray-900">Registration</h4>
                  <p className="text-sm text-gray-600 mt-1">✅ Created</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard