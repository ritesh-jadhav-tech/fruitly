import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, XCircle } from 'lucide-react'
import {
  fetchMyOrders, cancelOrder,
  selectMyOrders, selectOrdersLoading, selectOrdersPaging,
} from '@/features/orders/ordersSlice'
import { formatPrice, formatDate } from '@/utils/formatters'
import { ORDER_STATUS_COLORS } from '@/utils/constants'
import Badge    from '@/components/ui/Badge'
import Button   from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

function OrderCard({ order }) {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const statusColor = ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    const result = await dispatch(cancelOrder(order._id))
    if (cancelOrder.fulfilled.match(result)) {
      toast.success('Order cancelled successfully')
    } else {
      toast.error('Could not cancel order')
    }
    setCancelling(false)
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Package size={18} className="text-brand-700" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="text-sm font-mono font-semibold text-gray-900">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
            <p className="text-sm font-bold text-brand-900">{formatPrice(order.totalPrice)}</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product?.name || 'Product'}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping + totals */}
          <div className="border-t border-gray-100 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Delivery Address</p>
              <p className="text-gray-700">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress?.street}</p>
              <p className="text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Payment</span>
                <span className="font-medium capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span className="font-medium">{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium">{order.deliveryPrice === 0 ? 'FREE' : formatPrice(order.deliveryPrice)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t">
                <span>Total</span>
                <span className="text-brand-900">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          {['pending', 'confirmed'].includes(order.status) && (
            <div className="pt-1">
              <Button
                variant="danger"
                size="sm"
                loading={cancelling}
                onClick={handleCancel}
              >
                <XCircle size={15} /> Cancel Order
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const dispatch   = useDispatch()
  const orders     = useSelector(selectMyOrders)
  const loading    = useSelector(selectOrdersLoading)
  const paging     = useSelector(selectOrdersPaging)
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchMyOrders({ page, limit: 10 }))
  }, [dispatch, page])

  if (loading) return <PageSpinner />

  return (
    <div className="page-container py-10 max-w-3xl mx-auto">
      <h1 className="section-title mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Start shopping to see your orders here."
          actionLabel="Shop Now"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
          <div className="pt-4">
            <Pagination page={page} totalPages={paging.totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  )
}
