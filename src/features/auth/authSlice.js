import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'

// ── Load persisted auth from localStorage ─────────────────────────────────────
const storedToken = localStorage.getItem('fruitmart_token')
const storedUser  = (() => {
  try { return JSON.parse(localStorage.getItem('fruitmart_user')) } catch { return null }
})()

// ── Thunks ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(credentials)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(userData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
  } catch (err) {
    // Logout should always succeed on client side even if server fails
    return
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authService.getMe()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await authService.updateProfile(profileData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Update failed')
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function persistUser(user, token) {
  localStorage.setItem('fruitmart_token', token)
  localStorage.setItem('fruitmart_user', JSON.stringify(user))
}

function clearPersisted() {
  localStorage.removeItem('fruitmart_token')
  localStorage.removeItem('fruitmart_user')
}

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            storedUser,
    token:           storedToken,
    isLoading:       false,
    error:           null,
    isAuthenticated: !!storedToken,
  },
  reducers: {
    clearError:      (state) => { state.error = null },
    setCredentials:  (state, action) => {
      const { user, token } = action.payload
      state.user  = user
      state.token = token
      state.isAuthenticated = true
      persistUser(user, token)
    },
    clearCredentials: (state) => {
      state.user  = null
      state.token = null
      state.isAuthenticated = false
      clearPersisted()
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading      = false
        state.user           = action.payload.user
        state.token          = action.payload.token
        state.isAuthenticated = true
        persistUser(action.payload.user, action.payload.token)
      })
      .addCase(loginUser.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

    // Register
    builder
      .addCase(registerUser.pending,   (state) => { state.isLoading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading      = false
        state.user           = action.payload.user
        state.token          = action.payload.token
        state.isAuthenticated = true
        persistUser(action.payload.user, action.payload.token)
      })
      .addCase(registerUser.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user           = null
      state.token          = null
      state.isAuthenticated = false
      clearPersisted()
    })

    // Fetch me
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        localStorage.setItem('fruitmart_user', JSON.stringify(action.payload.user))
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user           = null
        state.token          = null
        state.isAuthenticated = false
        clearPersisted()
      })

    // Update profile
    builder
      .addCase(updateUserProfile.pending,   (state) => { state.isLoading = true })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user      = action.payload.user
        localStorage.setItem('fruitmart_user', JSON.stringify(action.payload.user))
      })
      .addCase(updateUserProfile.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })
  },
})

export const { clearError, setCredentials, clearCredentials } = authSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth            = (state) => state.auth
export const selectCurrentUser     = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
// Backend Vendors become role='admin' after normalization in Auth.controler.js
export const selectIsAdmin         = (state) => state.auth.user?.role === 'admin'
export const selectAuthLoading     = (state) => state.auth.isLoading
export const selectAuthError       = (state) => state.auth.error

export default authSlice.reducer
