import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { User, Mail, Phone, Lock, Save } from 'lucide-react'
import { getInitials } from '@/utils/formatters'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import toast  from 'react-hot-toast'

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuth()

  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  })
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})
  const [pwErrors, setPwErrors]           = useState({})

  const validateProfile = () => {
    const e = {}
    if (!profile.name.trim() || profile.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    setProfileErrors(e)
    return Object.keys(e).length === 0
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return
    await updateProfile(profile)
  }

  const validatePw = () => {
    const e = {}
    if (!pwForm.currentPassword) e.currentPassword = 'Required'
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) e.newPassword = 'Min. 6 characters'
    if (pwForm.newPassword !== pwForm.confirm) e.confirm = 'Passwords do not match'
    setPwErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!validatePw()) return
    setPwLoading(true)
    try {
      await authService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      })
      toast.success('Password updated successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  const set = (setter, field) => (e) => setter(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="page-container py-10 max-w-3xl mx-auto">
      <h1 className="section-title mb-8">My Profile</h1>

      {/* Avatar card */}
      <div className="card p-6 flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-brand-900 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {getInitials(user?.name)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-brand-100 text-brand-800'
          }`}>
            {user?.role === 'admin' ? '👑 Admin' : '🧑 Customer'}
          </span>
        </div>
      </div>

      {/* Profile info */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <User size={18} className="text-brand-700" /> Personal Information
        </h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={profile.name}
            error={profileErrors.name}
            leftIcon={<User size={16} />}
            onChange={set(setProfile, 'name')}
          />
          <Input
            label="Email Address"
            type="email"
            value={user?.email || ''}
            leftIcon={<Mail size={16} />}
            disabled
            helperText="Email cannot be changed"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={profile.phone}
            leftIcon={<Phone size={16} />}
            placeholder="10-digit mobile number"
            onChange={set(setProfile, 'phone')}
          />
          <div className="pt-1">
            <Button type="submit" loading={isLoading}>
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Lock size={18} className="text-brand-700" /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            value={pwForm.currentPassword}
            error={pwErrors.currentPassword}
            leftIcon={<Lock size={16} />}
            placeholder="Enter current password"
            onChange={set(setPwForm, 'currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            required
            value={pwForm.newPassword}
            error={pwErrors.newPassword}
            leftIcon={<Lock size={16} />}
            placeholder="Min. 6 characters"
            onChange={set(setPwForm, 'newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={pwForm.confirm}
            error={pwErrors.confirm}
            leftIcon={<Lock size={16} />}
            placeholder="Re-enter new password"
            onChange={set(setPwForm, 'confirm')}
          />
          <div className="pt-1">
            <Button type="submit" loading={pwLoading} variant="secondary">
              <Lock size={16} /> Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
