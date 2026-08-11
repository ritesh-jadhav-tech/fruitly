import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { userService } from '@/services/userService'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllOrders, selectAllOrders } from '@/features/orders/ordersSlice'
import StatCard from '@/components/admin/StatCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice, formatDateTime } from '@/utils/formatters'
import { ORDER_STATUS_COLORS } from '@/utils/constants'

export default function Dashboard() {
  const dispatch = useDispatch()
  const recentOrders = useSelector(selectAllOrders)
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await userService.getStats()
        setStats(data.stats)
      } catch {
        setStats({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalProducts: 0 })
      } finally {
        setLoading(false)
      }
    }
    load()
    dispatch(fetchAllOrders({ page: 1, limit: 8 }))
  }, [dispatch])

  if (loading) return <PageSpinner />

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with FruitMart.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue"   value={formatPrice(stats?.totalRevenue  || 0)} change={12}  color="brand"  />
        <StatCard icon={ShoppingBag} label="Total Orders"   value={stats?.totalOrders   || 0}              change={8}   color="blue"   />
        <StatCard icon={Package}     label="Total Products" value={stats?.totalProducts  || 0}              change={3}   color="amber"  />
        <StatCard icon={Users}       label="Total Users"    value={stats?.totalUsers     || 0}              change={15}  color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-brand-700" /> Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-sm text-brand-700 hover:text-brand-900 font-medium">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order</th>
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.slice(0, 8).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs font-semibold text-gray-700">
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-700">
                      {order.user?.name || '—'}
                    </td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-400">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-700" /> Quick Actions
            </h2>
            <div className="space-y-2.5">
              {[
                { to: '/admin/products/new',  label: '+ Add New Product',  color: 'bg-brand-50 text-brand-800 hover:bg-brand-100' },
                { to: '/admin/categories',    label: '+ Add Category',      color: 'bg-amber-50 text-amber-800 hover:bg-amber-100' },
                { to: '/admin/orders',        label: '📦 Manage Orders',    color: 'bg-blue-50 text-blue-800 hover:bg-blue-100'   },
                { to: '/admin/users',         label: '👥 Manage Users',     color: 'bg-purple-50 text-purple-800 hover:bg-purple-100' },
              ].map(({ to, label, color }) => (
                <Link key={to} to={to}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${color}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Order status breakdown */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Orders by Status</h2>
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => {
              const count = recentOrders.filter(o => o.status === status).length
              return (
                <div key={status} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[status]}`}>
                    {status}
                  </span>
                  <span className="text-sm font-bold text-gray-800">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
