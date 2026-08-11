import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { categoryService } from '@/services/categoryService'

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await categoryService.getAll()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

// Categories are derived from product strings — no create/update/delete
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items:     [],
    isLoading: false,
    error:     null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        // Backend returns { categories: [{ _id: "Fruits", name: "Fruits" }, ...] }
        state.items = action.payload.categories || []
      })
      .addCase(fetchCategories.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })
  },
})

export const selectCategories        = (state) => state.categories.items
export const selectCategoriesLoading = (state) => state.categories.isLoading

export default categoriesSlice.reducer
