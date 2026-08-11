import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingBag, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import {
  fetchAllOrders, updateOrderStatus,
  selectAllOrders, selectOrdersLoading, selectOrdersPaging,
} from '@/features/orders/ordersSlice'
import { formatPrice, formatDateTime } from '@/utils/formatters'
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '@/utils/constants'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = Object.values(ORDER_STATUS)

function OrderRow({ order }) {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    const result = await dispatch(updateOrderStatus({ id: order._id, status: newStatus }))
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success(`Order status updated to "${newStatus}"`)
    } else {
      toast.error('Failed to update status')
    }
    setUpdating(false)
  }

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="py-4 px-5">
          <span className="font-mono text-xs font-bold text-gray-700">
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        </td>
        <td className="py-4 px-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{order.user?.name || '—'}</p>
            <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
          </div>
        </td>
        <td className="py-4 px-4 text-xs text-gray-500">
          {formatDateTime(order.createdAt)}
        </td>
        <td className="py-4 px-4">
          <span className="text-sm font-bold text-gray-900">{formatPrice(order.totalPrice)}</span>
        </td>
        <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
          <select
            value={order.status}
            disabled={updating}
            onChange={e => handleStatusChange(e.target.value)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-700 ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'} border-transparent`}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="bg-white text-gray-900 font-normal">{s}</option>
            ))}
          </select>
        </td>
        <td className="py-4 px-4 text-center">
          {expanded
            ? <ChevronUp size={16} className="text-gray-400 mx-auto" />
            : <ChevronDown size={16} className="text-gray-400 mx-auto" />}
        </td>
      </tr>

      {/* Expanded row */}
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-gray-50 border-t border-b border-gray-100 px-5 py-5">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Items */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Items</h4>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & summary */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-700">{order.shippingAddress?.fullName}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress?.street}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                  </p>
                  <p className="text-sm text-gray-600">📞 {order.shippingAddress?.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Payment</h4>
                  <p className="text-sm capitalize text-gray-700">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function OrdersManagement() {
  const dispatch = useDispatch()
  const orders   = useSelector(selectAllOrders)
  const loading  = useSelector(selectOrdersLoading)
  const paging   = useSelector(selectOrdersPaging)
  const [page, setPage]           = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const load = (p = page, status = statusFilter) => {
    dispatch(fetchAllOrders({ page: p, limit: 15, ...(status && { status }) }))
  }

  useEffect(() => { load() }, [dispatch]) // eslint-disable-line

  const handleStatusFilter = (s) => {
    setStatusFilter(s)
    setPage(1)
    load(1, s)
  }

  const handlePage = (p) => {
    setPage(p)
    load(p)
  }

  if (loading && orders.length === 0) return <PageSpinner />

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{paging.total} total orders</p>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s || 'all'}
            onClick={() => handleStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === s
                ? 'bg-brand-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders found" description="No orders match your current filter." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => <OrderRow key={order._id} order={order} />)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6">
            <Pagination page={page} totalPages={paging.totalPages} onPageChange={handlePage} />
          </div>
        </>
      )}
    </div>
  )
}
