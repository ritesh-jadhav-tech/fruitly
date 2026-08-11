import { useSelector, useDispatch } from 'react-redux'
import {
  selectCartItems, selectCartCount, selectCartSubtotal,
  selectCartTotal, selectCartDiscount, selectCartIsOpen,
  addToCart, removeFromCart, updateQuantity, clearCart,
  toggleCart, openCart, closeCart,
} from '@/features/cart/cartSlice'
import toast from 'react-hot-toast'

export const useCart = () => {
  const dispatch = useDispatch()

  const items     = useSelector(selectCartItems)
  const count     = useSelector(selectCartCount)
  const subtotal  = useSelector(selectCartSubtotal)
  const total     = useSelector(selectCartTotal)
  const discount  = useSelector(selectCartDiscount)
  const isOpen    = useSelector(selectCartIsOpen)

  const addItem = (product) => {
    dispatch(addToCart(product))
    toast.success(`${product.name} added to cart`)
  }

  const removeItem = (id) => {
    dispatch(removeFromCart(id))
    toast('Item removed from cart', { icon: '🗑️' })
  }

  const changeQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  const empty = () => dispatch(clearCart())

  const isInCart = (id) => items.some(i => i._id === id)

  const getItemQuantity = (id) => items.find(i => i._id === id)?.quantity || 0

  return {
    items, count, subtotal, total, discount, isOpen,
    addItem, removeItem, changeQuantity, empty,
    isInCart, getItemQuantity,
    toggle: () => dispatch(toggleCart()),
    open:   () => dispatch(openCart()),
    close:  () => dispatch(closeCart()),
  }
}
