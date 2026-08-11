import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { selectLastPlaced } from '@/features/orders/ordersSlice'
import { formatPrice, formatDate } from '@/utils/formatters'
import Button from '@/components/ui/Button'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const order    = useSelector(selectLastPlaced)

  useEffect(() => {
    if (!order) navigate('/')
  }, [order, navigate])

  if (!order) return null

  return (
    <div className="page-container py-16 max-w-2xl mx-auto text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={52} className="text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your order. We'll start preparing it right away.
      </p>

      {/* Order card */}
      <div className="card p-6 text-left mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
            <p className="text-sm font-mono font-semibold text-gray-900">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-5">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-brand-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name || 'Product'}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Payment Method</span>
            <span className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery to</span>
            <span className="font-medium text-right max-w-[200px]">
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
            <span>Total Paid</span>
            <span className="text-brand-900">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="card p-5 text-left mb-8 bg-brand-50 border-brand-100">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">What happens next?</h3>
        <ul className="space-y-2 text-sm text-brand-800">
          <li className="flex items-start gap-2"><span className="text-brand-600 font-bold">1.</span> We'll confirm your order within 30 minutes.</li>
          <li className="flex items-start gap-2"><span className="text-brand-600 font-bold">2.</span> Your fruits will be freshly packed and dispatched.</li>
          <li className="flex items-start gap-2"><span className="text-brand-600 font-bold">3.</span> Estimated delivery: 1–2 business days.</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders">
          <Button variant="secondary" size="lg">Track My Orders</Button>
        </Link>
        <Link to="/shop">
          <Button size="lg">
            Continue Shopping <ArrowRight size={17} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
