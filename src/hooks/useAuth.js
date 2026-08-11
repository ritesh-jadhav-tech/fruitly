import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentUser, selectIsAuthenticated, selectIsAdmin,
  selectAuthLoading, selectAuthError, clearError,
  loginUser, registerUser, logoutUser, updateUserProfile,
} from '@/features/auth/authSlice'
import { clearCart } from '@/features/cart/cartSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user            = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin         = useSelector(selectIsAdmin)
  const isLoading       = useSelector(selectAuthLoading)
  const error           = useSelector(selectAuthError)

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) {
      const u = result.payload.user
      // Greet with name (normalized from backend username)
      toast.success(`Welcome back, ${u.name || u.username || 'User'}!`)
      // Redirect: Vendor (role=admin) → admin panel, Customer → home
      navigate(u.role === 'admin' ? '/admin/dashboard' : (credentials.redirectTo || '/'))
      return true
    }
    return false
  }

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!')
      navigate('/')
      return true
    }
    return false
  }

  const logout = async () => {
    await dispatch(logoutUser())
    dispatch(clearCart())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const updateProfile = async (data) => {
    const result = await dispatch(updateUserProfile(data))
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Profile updated!')
      return true
    }
    return false
  }

  const dismissError = () => dispatch(clearError())

  return {
    user, isAuthenticated, isAdmin, isLoading, error,
    login, register, logout, updateProfile, dismissError,
  }
}
