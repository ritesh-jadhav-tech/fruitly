import api from './api'

export const userService = {
  // GET /admin/stats
  getStats: () => api.get('/admin/stats'),

  // GET /admin/users
  getAll: (params) => api.get('/admin/users', { params }),

  // GET /admin/users/:id
  getById: (id) => api.get(`/admin/users/${id}`),

  // PUT /admin/users/:id
  update: (id, data) => api.put(`/admin/users/${id}`, data),

  // DELETE /admin/users/:id
  remove: (id) => api.delete(`/admin/users/${id}`),
}
