import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 px-4 h-16 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 font-bold text-brand-900">
            <span>🍊</span> FruitMart Admin
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <ConfirmDialog />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
