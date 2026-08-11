export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

export const ORDER_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  PROCESSING:'processing',
  SHIPPED:   'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

export const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
]

export const ITEMS_PER_PAGE = 12

export const MAX_CART_QUANTITY = 20
