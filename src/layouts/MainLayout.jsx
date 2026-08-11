import { Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import CartDrawer from '@/components/shared/CartDrawer'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      <CartDrawer />
      <ConfirmDialog />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
