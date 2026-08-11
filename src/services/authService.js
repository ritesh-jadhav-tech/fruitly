import api from './api'

export const authService = {
  // POST /auth/register — create new account
  register: (data) => api.post('/auth/register', data),

  // POST /auth/login — email + password
  login: (data) => api.post('/auth/login', data),

  // POST /auth/logout
  logout: () => api.post('/auth/logout'),

  // GET /auth/me — fetch current user from token
  getMe: () => api.get('/auth/me'),

  // PUT /auth/me — update profile (name)
  updateProfile: (data) => api.put('/auth/me', data),

  // PUT /auth/change-password
  changePassword: (data) => api.put('/auth/change-password', data),

  // Forgot/reset password — not implemented in backend yet, kept as no-ops
  forgotPassword: (email) => Promise.resolve({ data: { message: 'If that email exists, a reset link was sent.' } }),
  resetPassword: (data) => Promise.resolve({ data: { message: 'Password reset.' } }),
}
