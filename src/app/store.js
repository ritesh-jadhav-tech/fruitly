import { configureStore } from '@reduxjs/toolkit'
import authReducer       from '@/features/auth/authSlice'
import cartReducer       from '@/features/cart/cartSlice'
import productsReducer   from '@/features/products/productsSlice'
import ordersReducer     from '@/features/orders/ordersSlice'
import categoriesReducer from '@/features/categories/categoriesSlice'
import uiReducer         from '@/features/ui/uiSlice'

const store = configureStore({
  reducer: {
    auth:       authReducer,
    cart:       cartReducer,
    products:   productsReducer,
    orders:     ordersReducer,
    categories: categoriesReducer,
    ui:         uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export default store
