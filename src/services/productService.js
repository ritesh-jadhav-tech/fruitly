import api from './api'

export const productService = {
  // GET /products — paginated + filtered
  getAll: (params) => api.get('/products', { params }),

  // GET /products/:id
  getById: (id) => api.get(`/products/${id}`),

  // GET /products/featured
  getFeatured: () => api.get('/products/featured'),

  // POST /file/uplode — Vendor only, multipart form data
  // FormData fields: image (file), name, price, stock, category, description, brand, unit
  create: (data) =>
    api.post('/file/uplode', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // PUT /data/update — Vendor only, update product fields
  update: (id, data) => {
    // If data is FormData, extract fields and post as JSON to /data/update
    if (data instanceof FormData) {
      const body = { _id: id }
      for (const [key, value] of data.entries()) {
        if (key !== 'images') body[key] = value
      }
      // Map frontend field names to backend field names
      if (body.name) { body.product_name = body.name; delete body.name }
      return api.put('/data/update', body)
    }
    return api.put('/data/update', { _id: id, ...data })
  },

  // POST /file/delete — Vendor only, deletes image from Cloudinary + DB record
  remove: (id, public_id) =>
    api.post('/file/delete', { _id: id, id, public_id: public_id || '' }),

  // Reviews — not implemented in backend, no-op
  addReview: (id, data) => Promise.resolve({ data: {} }),
}
