import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  ChevronRight, LogOut, X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const links = [
  { to: '/admin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/products',    label: 'Products',     icon: Package },
  { to: '/admin/categories',  label: 'Categories',   icon: Tag },
  { to: '/admin/orders',      label: 'Orders',       icon: ShoppingBag },
  { to: '/admin/users',       label: 'Users',        icon: Users },
]

export default function AdminSidebar({ onClose }) {
  const { logout, user } = useAuth()

  return (
    <aside className="flex flex-col h-full bg-brand-900 text-white w-64">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🍊</span> FruitMart
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-white/10">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Admin badge */}
      <div className="mx-4 mt-4 px-4 py-3 bg-white/10 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-400 text-brand-900 flex items-center justify-center font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-brand-300">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-[11px] uppercase tracking-widest text-brand-400 font-semibold px-3 mb-3">Main Menu</p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin/dashboard'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-brand-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={18} />
              {label}
            </span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5 space-y-1">
        <hr className="border-white/10 mb-3" />
        <Link to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
          <Package size={18} />
          View Store
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-300 hover:text-red-200 hover:bg-white/10 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
