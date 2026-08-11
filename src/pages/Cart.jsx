import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/formatters'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

export default function Cart() {
  const { items, subtotal, total, discount, removeItem, changeQuantity, empty } = useCart()

  if (items.length === 0) {
    return (
      <div className="page-container py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          actionLabel="Start Shopping"
          onAction={() => {}}
        />
        <div className="text-center mt-2">
          <Link to="/shop" className="text-brand-900 font-medium hover:underline">Browse Products →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card p-5 flex gap-4">
              <Link to={`/products/${item._id}`} className="flex-shrink-0">
                <img
                  src={item.images?.[0] || '/placeholder-fruit.jpg'}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover bg-gray-50"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="text-sm font-semibold text-gray-900 hover:text-brand-900 block">
                  {item.name}
                </Link>
                {item.unit && <p className="text-xs text-gray-400 mt-0.5">per {item.unit}</p>}
                <p className="text-brand-900 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
                    <button onClick={() => changeQuantity(item._id, item.quantity - 1)}
                      className="text-gray-500 hover:text-brand-900 transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => changeQuantity(item._id, item.quantity + 1)}
                      className="text-gray-500 hover:text-brand-900 transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link to="/shop" className="text-sm text-brand-900 hover:underline font-medium">
              ← Continue Shopping
            </Link>
            <button onClick={empty} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className={subtotal >= 499 ? 'text-green-600 font-medium' : 'font-medium'}>
                {subtotal >= 499 ? 'FREE' : formatPrice(49)}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-brand-900">{formatPrice(subtotal >= 499 ? total : total + 49)}</span>
          </div>
          {subtotal < 499 && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Add {formatPrice(499 - subtotal)} more for free delivery!
            </p>
          )}
          <Link to="/checkout">
            <Button fullWidth size="lg">
              Proceed to Checkout <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
