import { BrowserRouter } from 'react-router-dom'
import { Provider }      from 'react-redux'
import { Toaster }       from 'react-hot-toast'
import store             from '@/app/store'
import AppRoutes         from '@/routes/AppRoutes'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#1B4332', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  )
}
