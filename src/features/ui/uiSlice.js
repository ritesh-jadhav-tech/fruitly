import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    globalLoading: false,
    mobileMenuOpen: false,
    confirmDialog: {
      isOpen:  false,
      title:   '',
      message: '',
      onConfirm: null,
    },
  },
  reducers: {
    setGlobalLoading:  (state, action) => { state.globalLoading = action.payload },
    toggleMobileMenu:  (state)         => { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu:   (state)         => { state.mobileMenuOpen = false },
    openConfirmDialog: (state, action) => { state.confirmDialog = { isOpen: true, ...action.payload } },
    closeConfirmDialog:(state)         => { state.confirmDialog = { isOpen: false, title: '', message: '', onConfirm: null } },
  },
})

export const {
  setGlobalLoading, toggleMobileMenu, closeMobileMenu,
  openConfirmDialog, closeConfirmDialog,
} = uiSlice.actions

export const selectGlobalLoading  = (state) => state.ui.globalLoading
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectConfirmDialog  = (state) => state.ui.confirmDialog

export default uiSlice.reducer
