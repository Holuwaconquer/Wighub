import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import { forgotPassword } from '../services/api'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await forgotPassword(email)
      // If backend returns resetUrl in dev, you can show it for testing
      if (res?.resetUrl) {
        // Optionally show link in UI for local testing (not recommended in prod)
        setError('')
        setSubmitted(true)
        // store for display if needed
        localStorage.setItem('lastResetUrl', res.resetUrl)
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.message || err?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }
  const lastResetUrl = typeof window !== 'undefined' ? localStorage.getItem('lastResetUrl') : null

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            {/* {lastResetUrl && (
              <p className="text-xs text-gray-400 break-words">Test link: <a href={lastResetUrl} className="text-[#9b83a3] underline">Open reset link</a></p>
            )} */}
            
            <Link to="/login">
              <button className="text-[#9b83a3] font-semibold hover:underline">
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Back Button */}
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#9b83a3] mb-6">
            <FaArrowLeft className="text-sm" />
            Back to Login
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#9b83a3] text-white rounded-lg font-semibold hover:bg-[#8c6020] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-[#8c6020] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage