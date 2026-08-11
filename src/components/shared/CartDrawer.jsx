import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/formatters'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

export default function CartDrawer() {
  const { items, count, subtotal, total, discount, isOpen, close, removeItem, changeQuantity } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={close} />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-900" />
            <h2 className="font-semibold text-gray-900">Cart ({count})</h2>
          </div>
          <button onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Add some fresh fruits to get started!"
              actionLabel="Shop Now"
              onAction={() => { close(); }}
            />
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <img
                  src={item.images?.[0] || '/placeholder-fruit.jpg'}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-brand-900 font-bold mt-0.5">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => changeQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-gray-900 pt-1 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" onClick={close}>
              <Button fullWidth size="lg">Proceed to Checkout</Button>
            </Link>
            <Link to="/cart" onClick={close} className="block text-center text-sm text-brand-900 hover:underline">
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
