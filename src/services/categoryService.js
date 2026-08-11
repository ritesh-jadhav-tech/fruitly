import api from './api'

export const categoryService = {
  // GET /categories — derives distinct categories from products table
  getAll: () => api.get('/categories'),

  // These operations are not supported by the backend
  // (categories are derived from product.category strings, not a separate table)
  getById: (id) => Promise.resolve({ data: { category: { _id: id, name: id } } }),
  create: () => Promise.reject(new Error('Category creation not supported')),
  update: () => Promise.reject(new Error('Category update not supported')),
  remove: () => Promise.reject(new Error('Category deletion not supported')),
}
