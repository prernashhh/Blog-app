import { useState } from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@blogbase.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/admin')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-10 md:px-12 md:py-14">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#4DB6AC] transition-colors mb-6 group">
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#4DB6AC] text-center mb-2 tracking-tight" style={{fontFamily: 'Inter, Segoe UI, sans-serif'}}>Admin Login</h2>
          <p className="text-center text-base text-gray-600 mb-8">Sign in to access the admin dashboard</p>
          
          {/* Default Credentials Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">Default Credentials:</p>
            <p className="text-sm text-blue-800"><span className="font-medium">Email:</span> admin@blogbase.com</p>
            <p className="text-sm text-blue-800"><span className="font-medium">Password:</span> admin123</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4DB6AC] focus:border-[#4DB6AC] bg-white/90 shadow-sm transition-all text-base"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4DB6AC] focus:border-[#4DB6AC] bg-white/90 shadow-sm transition-all text-base"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-[#4DB6AC] hover:bg-[#FF8A65] shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DB6AC] disabled:opacity-50 animate-fade-in"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
