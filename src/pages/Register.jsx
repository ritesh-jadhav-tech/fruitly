import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'

export default function Register() {
  const { register, isLoading, error, dismissError } = useAuth()

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { return () => dismissError() }, []) // eslint-disable-line

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    // Map form.name → username (what backend expects) and add type: Customer
    await register({
      username: form.name.trim(),
      name:     form.name.trim(),
      email:    form.email.trim(),
      password: form.password,
      type:     'Customer',
    })
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍊</div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join FruitMart and get fresh fruits delivered</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Full Name"
              type="text"
              required
              value={form.name}
              error={errors.name}
              leftIcon={<User size={16} />}
              placeholder="John Doe"
              onChange={set('name')}
              autoComplete="name"
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={form.email}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              placeholder="you@example.com"
              onChange={set('email')}
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
              placeholder="Min. 6 characters"
              onChange={set('password')}
              helperText="At least 6 characters"
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type={showPw ? 'text' : 'password'}
              required
              value={form.confirm}
              error={errors.confirm}
              leftIcon={<Lock size={16} />}
              placeholder="Re-enter password"
              onChange={set('confirm')}
              autoComplete="new-password"
            />

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-0.5 accent-brand-900" id="terms" />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-brand-900 hover:underline font-medium">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-brand-900 hover:underline font-medium">Privacy Policy</a>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-900 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
