import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '@/services/productService'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await productService.getAll(params)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await productService.getById(id)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productService.getFeatured()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await productService.create(formData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await productService.update(id, formData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async ({ id, public_id }, { rejectWithValue }) => {
  try {
    await productService.remove(id, public_id)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:       [],
    featured:    [],
    current:     null,
    total:       0,
    page:        1,
    totalPages:  1,
    isLoading:   false,
    error:       null,
    filters: {
      search:   '',
      category: '',
      sort:     'newest',
      minPrice: '',
      maxPrice: '',
      page:     1,
    },
  },
  reducers: {
    setFilters:         (state, action) => { state.filters = { ...state.filters, ...action.payload, page: 1 } },
    setPage:            (state, action) => { state.filters.page = action.payload },
    resetFilters:       (state) => { state.filters = { search: '', category: '', sort: 'newest', minPrice: '', maxPrice: '', page: 1 } },
    clearCurrentProduct:(state) => { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading  = false
        state.items      = action.payload.products || []
        state.total      = action.payload.total    || 0
        state.totalPages = action.payload.totalPages || 1
        state.page       = action.payload.page       || 1
      })
      .addCase(fetchProducts.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(fetchProductById.pending,    (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchProductById.fulfilled,  (state, action) => { state.isLoading = false; state.current = action.payload.product })
      .addCase(fetchProductById.rejected,   (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.featured = action.payload.products || [] })

      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload.result) state.items.unshift(action.payload.result)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload.result
        if (updated) {
          const idx = state.items.findIndex(p => p._id === updated._id)
          if (idx !== -1) state.items[idx] = updated
          if (state.current?._id === updated._id) state.current = updated
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deletedId = String(action.payload)
        state.items = state.items.filter(p => String(p.id) !== deletedId && p._id !== deletedId)
      })
  },
})

export const { setFilters, setPage, resetFilters, clearCurrentProduct } = productsSlice.actions

export const selectProducts         = (state) => state.products.items
export const selectFeaturedProducts = (state) => state.products.featured
export const selectCurrentProduct   = (state) => state.products.current
export const selectProductsLoading  = (state) => state.products.isLoading
export const selectProductsError    = (state) => state.products.error
export const selectProductFilters   = (state) => state.products.filters
export const selectProductsPaging   = (state) => ({ total: state.products.total, totalPages: state.products.totalPages, page: state.products.page })

export default productsSlice.reducer
