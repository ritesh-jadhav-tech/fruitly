import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Package } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import SearchBar from './SearchBar'

const navLinks = [
  { to: '/',      label: 'Home' },
  { to: '/shop',  label: 'Shop' },
]

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { count, toggle: toggleCart } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="page-container flex items-center gap-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2 font-bold text-xl text-brand-900">
          <span className="text-2xl">🍊</span>
          <span className="hidden sm:block">FruitMart</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-900 bg-brand-50' : 'text-gray-600 hover:text-brand-900 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden md:block">
          <SearchBar onSearch={(q) => navigate(`/shop?search=${encodeURIComponent(q)}`)} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block truncate max-w-[100px]">{user?.name}</span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={16} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-900 font-medium hover:bg-brand-50">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1.5 border-gray-100" />
                    <button onClick={() => { logout(); setProfileOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-900 rounded-lg hover:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-brand-900 text-white rounded-lg hover:bg-brand-800 transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <SearchBar onSearch={(q) => { navigate(`/shop?search=${encodeURIComponent(q)}`); setMobileOpen(false) }} />
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-brand-900 bg-brand-50' : 'text-gray-700 hover:bg-gray-50'}`
              }
            >
              {label}
            </NavLink>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium border border-brand-900 text-brand-900 rounded-lg">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 text-sm font-semibold bg-brand-900 text-white rounded-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
