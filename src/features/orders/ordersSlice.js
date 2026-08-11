import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '@/services/orderService'

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderService.getMyOrders(params)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await orderService.getById(id)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await orderService.create(orderData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const { data } = await orderService.cancel(id)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

// Admin
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderService.getAllOrders(params)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await orderService.updateStatus(id, status)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders:   [],
    allOrders:  [],
    current:    null,
    lastPlaced: null,
    total:      0,
    totalPages: 1,
    isLoading:  false,
    error:      null,
  },
  reducers: {
    clearLastPlaced: (state) => { state.lastPlaced = null },
    clearOrderError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading  = false
        state.myOrders   = action.payload.orders    || []
        state.total      = action.payload.total     || 0
        state.totalPages = action.payload.totalPages || 1
      })
      .addCase(fetchMyOrders.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(fetchOrderById.fulfilled, (state, action) => { state.current = action.payload.order })

      .addCase(placeOrder.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading  = false
        // Backend returns { order, ack } — use whichever is present
        const order = action.payload.order || action.payload.ack
        state.lastPlaced = order
        if (order) state.myOrders.unshift(order)
      })
      .addCase(placeOrder.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updated = action.payload.order
        if (!updated) return
        const idx = state.myOrders.findIndex(o => o._id === updated._id)
        if (idx !== -1) state.myOrders[idx] = updated
        if (state.current?._id === updated._id) state.current = updated
      })

      .addCase(fetchAllOrders.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading  = false
        state.allOrders  = action.payload.orders    || []
        state.total      = action.payload.total     || 0
        state.totalPages = action.payload.totalPages || 1
      })
      .addCase(fetchAllOrders.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.order
        if (!updated) return
        const idx = state.allOrders.findIndex(o => o._id === updated._id)
        if (idx !== -1) state.allOrders[idx] = updated
      })
  },
})

export const { clearLastPlaced, clearOrderError } = ordersSlice.actions

export const selectMyOrders     = (state) => state.orders.myOrders
export const selectAllOrders    = (state) => state.orders.allOrders
export const selectCurrentOrder = (state) => state.orders.current
export const selectLastPlaced   = (state) => state.orders.lastPlaced
export const selectOrdersLoading= (state) => state.orders.isLoading
export const selectOrdersError  = (state) => state.orders.error
export const selectOrdersPaging = (state) => ({ total: state.orders.total, totalPages: state.orders.totalPages })

export default ordersSlice.reducer
