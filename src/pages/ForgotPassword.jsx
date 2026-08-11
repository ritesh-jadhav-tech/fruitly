import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authService } from '@/services/authService'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import toast  from 'react-hot-toast'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍊</div>
          <h1 className="text-2xl font-bold text-gray-900">
            {sent ? 'Check your inbox' : 'Forgot your password?'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {sent
              ? `We sent a reset link to ${email}`
              : 'No worries — we\'ll send you reset instructions.'}
          </p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                If an account exists for <strong>{email}</strong>, you'll receive a password reset link within a few minutes.
              </p>
              <p className="text-xs text-gray-400">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-brand-900 hover:underline font-medium">
                  try again
                </button>.
              </p>
              <Link to="/login">
                <Button fullWidth variant="secondary">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                error={error}
                leftIcon={<Mail size={16} />}
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}

          {!sent && (
            <Link to="/login"
              className="flex items-center justify-center gap-1.5 mt-5 text-sm text-gray-500 hover:text-brand-900 transition-colors">
              <ArrowLeft size={15} /> Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
