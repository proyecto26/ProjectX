'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import ReactCodeInput from 'react-code-input'

type LoginState = 'email' | 'code'

type FormData = {
  email: string
  code: string
}

export function LoginPage() {
  const [loginState, setLoginState] = useState<LoginState>('email')
  const [formData, setFormData] = useState<FormData>({ email: '', code: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // Placeholder for email submission logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setLoginState('code')
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // Placeholder for code submission logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setError('Invalid code. Please try again.')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCodeChange = (code: string) => {
    setFormData(prev => ({ ...prev, code }))
  }

  return (
    <div className="flex-grow h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Log in</h2>
        {loginState === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  required
                />
                <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Login Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enter 6-digit Code
              </label>
              <ReactCodeInput
                  type="number"
                  fields={6}
                  onChange={handleCodeChange}
                  inputStyle={{
                    fontFamily: 'monospace',
                    margin: '4px',
                    MozAppearance: 'textfield',
                    width: '36px',
                    borderRadius: '3px',
                    fontSize: '14px',
                    height: '36px',
                    paddingLeft: '7px',
                    backgroundColor: 'white',
                    color: 'black',
                    border: '1px solid lightgrey'
                  }} name={''} inputMode={'email'}              />
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              onClick={() => setLoginState('email')}
            >
              Back to Email
            </button>
          </form>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}