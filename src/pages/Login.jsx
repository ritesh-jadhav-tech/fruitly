import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'

export default function Login() {
  const { login, isLoading, error, isAuthenticated, dismissError } = useAuth()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [errors, setErrors]   = useState({})

  useEffect(() => { return () => dismissError() }, []) // eslint-disable-line

  const validate = () => {
    const e = {}
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password.trim()) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await login({ ...form, redirectTo: from })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍊</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your FruitMart account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email Address"
              type="email"
              required
              value={form.email}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              placeholder="you@example.com"
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              required
              value={form.password}
              error={errors.password}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPw(v => !v)} className="focus:outline-none">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              placeholder="Your password"
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand-900 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-brand-900 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-900 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
