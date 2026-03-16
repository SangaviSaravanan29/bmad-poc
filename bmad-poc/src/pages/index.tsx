import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      void router.replace('/dashboard')
    }
  }, [router, user])

  if (user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
            Welcome to TaskFlow
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your personal task management solution
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Sign In
          </button>
          
          <button
            onClick={() => router.push('/register')}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}
