import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CreditCard, Banknote, Smartphone } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { placeOrder, selectOrdersLoading } from '@/features/orders/ordersSlice'
import { formatPrice } from '@/utils/formatters'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { value: 'cod',    label: 'Cash on Delivery',  icon: Banknote },
  { value: 'online', label: 'Online Payment',     icon: CreditCard },
  { value: 'upi',    label: 'UPI',                icon: Smartphone },
]

export default function Checkout() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { items, subtotal, total, discount, empty } = useCart()
  const loading   = useSelector(selectOrdersLoading)
  const delivery  = subtotal >= 499 ? 0 : 49

  const [address, setAddress] = useState({
    fullName: user?.name || user?.username || '',
    phone:    user?.phone || '',
    street:   '',
    city:     '',
    state:    '',
    country:  'India',
    pincode:  '',
  })
  const [payment, setPayment] = useState('cod')
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!address.fullName.trim()) e.fullName = 'Required'
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone)) e.phone = 'Valid 10-digit phone required'
    if (!address.street.trim()) e.street = 'Required'
    if (!address.city.trim())   e.city   = 'Required'
    if (!address.state.trim())  e.state  = 'Required'
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) e.pincode = 'Valid 6-digit pincode required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (items.length === 0) { toast.error('Cart is empty'); return }

    // Map to backend's expected shape
    // Backend Order.controler.js accepts shippingAddress + items + paymentMethod
    const orderData = {
      shippingAddress: address,
      paymentMethod:   payment,
      items: items.map(i => ({
        product:  i._id,
        name:     i.name || i.product_name || '',
        quantity: i.quantity,
        price:    parseFloat(i.price),
        image:    i.images?.[0] || i.url || '',
      })),
      itemsPrice:    subtotal,
      discountAmount:discount,
      deliveryPrice: delivery,
      totalPrice:    total + delivery,
      total:         total + delivery,
    }

    const result = await dispatch(placeOrder(orderData))
    if (placeOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully!')
      empty()
      navigate('/order-success')
    } else {
      toast.error(result.payload || 'Failed to place order')
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left: address + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-5">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" required value={address.fullName} error={errors.fullName}
                onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} />
              <Input label="Phone Number" required value={address.phone} error={errors.phone}
                placeholder="10-digit mobile number"
                onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} />
              <div className="sm:col-span-2">
                <Input label="Street Address" required value={address.street} error={errors.street}
                  placeholder="House No., Street, Area"
                  onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
              </div>
              <Input label="City" required value={address.city} error={errors.city}
                onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
              <Input label="State" required value={address.state} error={errors.state}
                onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
              <Input label="Pincode" required value={address.pincode} error={errors.pincode}
                placeholder="6-digit pincode"
                onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-5">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                <label key={value}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    payment === value ? 'border-brand-900 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input type="radio" name="payment" value={value} checked={payment === value}
                    onChange={() => setPayment(value)} className="accent-brand-900" />
                  <Icon size={20} className={payment === value ? 'text-brand-900' : 'text-gray-500'} />
                  <span className={`text-sm font-medium ${payment === value ? 'text-brand-900' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <div className="card p-6 h-fit space-y-4">
          <h2 className="font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map(item => (
              <div key={item._id} className="flex items-center gap-3">
                <img
                  src={item.images?.[0] || item.url || '/placeholder-fruit.jpg'}
                  alt={item.name || item.product_name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {item.name || item.product_name}
                  </p>
                  <p className="text-xs text-gray-500">× {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-gray-900 flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                {delivery === 0 ? 'FREE' : formatPrice(delivery)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span className="text-brand-900">{formatPrice(total + delivery)}</span>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Place Order
          </Button>
          <p className="text-xs text-center text-gray-400">By placing the order you agree to our Terms of Service</p>
        </div>
      </form>
    </div>
  )
}
