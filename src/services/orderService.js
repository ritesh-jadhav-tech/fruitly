import api from './api'

export const orderService = {
  // GET /order/my — user's own orders
  getMyOrders: (params) => api.get('/order/my', { params }),

  // GET /order/:id — single order detail
  getById: (id) => api.get(`/order/${id}`),

  // POST /order/data — place a new order
  create: (data) => api.post('/order/data', data),

  // PUT /order/:id/cancel — cancel a pending order
  cancel: (id) => api.put(`/order/${id}/cancel`),

  // Admin endpoints
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
}
