import { createSlice } from '@reduxjs/toolkit'
import { MAX_CART_QUANTITY } from '@/utils/constants'

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('fruitmart_cart')) || [] }
  catch { return [] }
}

const saveCart = (items) => {
  localStorage.setItem('fruitmart_cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:       loadCart(),
    isOpen:      false,
    couponCode:  null,
    discount:    0,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.items.find(i => i._id === product._id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, MAX_CART_QUANTITY)
      } else {
        state.items.push({ ...product, quantity: 1 })
      }
      saveCart(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload)
      saveCart(state.items)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i._id === id)
      if (item) {
        if (quantity < 1) {
          state.items = state.items.filter(i => i._id !== id)
        } else {
          item.quantity = Math.min(quantity, MAX_CART_QUANTITY)
        }
      }
      saveCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      state.couponCode = null
      state.discount = 0
      localStorage.removeItem('fruitmart_cart')
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen },
    openCart:   (state) => { state.isOpen = true },
    closeCart:  (state) => { state.isOpen = false },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code
      state.discount   = action.payload.discount
    },
    removeCoupon: (state) => {
      state.couponCode = null
      state.discount   = 0
    },
  },
})

export const {
  addToCart, removeFromCart, updateQuantity, clearCart,
  toggleCart, openCart, closeCart, applyCoupon, removeCoupon,
} = cartSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartItems    = (state) => state.cart.items
export const selectCartIsOpen   = (state) => state.cart.isOpen
export const selectCartCount    = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
export const selectCartDiscount = (state) => state.cart.discount
export const selectCartTotal    = (state) => {
  const subtotal = state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return subtotal - state.cart.discount
}

export default cartSlice.reducer
