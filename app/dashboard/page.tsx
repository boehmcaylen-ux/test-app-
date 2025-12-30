'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentProfile, signOut } from '@/lib/auth'

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  business_id: string
  businesses: {
    id: string
    name: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { profile, error } = await getCurrentProfile()

      if (error || !profile) {
        // Not logged in, redirect to login
        router.push('/')
        return
      }

      setProfile(profile)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.businesses.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {profile.full_name}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Working! 🎉
            </h2>

            <p className="text-gray-600 mb-8">
              You're successfully logged in to your dashboard.
            </p>

            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Your Account Info:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>{' '}
                  <span className="font-medium text-gray-900">{profile.full_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>{' '}
                  <span className="font-medium text-gray-900">{profile.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Business:</span>{' '}
                  <span className="font-medium text-gray-900">{profile.businesses.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>{' '}
                  <span className="font-medium text-gray-900 capitalize">{profile.role}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                <strong>Next Steps:</strong> We'll build the job management features here.
              </p>
              <p className="text-sm text-gray-500">
                For now, you can sign out and try logging in again to test authentication.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
