import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/formatters'
import Badge from '@/components/ui/Badge'

// Backend product shape:
// { _id, id, name (= product_name), images [= [url]], price, category (string), stock, unit, brand, description }
export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart()

  // Normalize product fields from backend
  const productName = product.name || product.product_name || 'Product'
  const productId   = product._id || String(product.id)
  const imageUrl    = product.images?.[0] || product.url || '/placeholder-fruit.jpg'
  const price       = parseFloat(product.price) || 0
  const inCart      = isInCart(productId)

  // Build a normalized product object for cart operations
  const normalizedProduct = {
    ...product,
    _id:   productId,
    name:  productName,
    price,
    images: product.images?.length ? product.images : (product.url ? [product.url] : []),
  }

  return (
    <div className="card group flex flex-col overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
      {/* Image */}
      <Link to={`/products/${productId}`} className="relative block overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">Out of Stock</span>
          </div>
        )}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
          aria-label="Wishlist"
        >
          <Heart size={16} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category badge — category is a plain string from backend */}
        {product.category && (
          <span className="text-xs font-medium text-brand-700 uppercase tracking-wide">
            {product.category}
          </span>
        )}
        <Link
          to={`/products/${productId}`}
          className="text-sm font-semibold text-gray-900 hover:text-brand-900 leading-snug line-clamp-2"
        >
          {productName}
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-brand-900">{formatPrice(price)}</span>
            {product.unit && <span className="ml-1 text-xs text-gray-500">/{product.unit}</span>}
          </div>
          <button
            disabled={product.stock === 0}
            onClick={() => addItem(normalizedProduct)}
            className={`p-2.5 rounded-xl transition-all ${
              inCart
                ? 'bg-brand-900 text-white'
                : 'bg-brand-50 text-brand-900 hover:bg-brand-900 hover:text-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="Add to cart"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
