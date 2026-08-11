import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronRight, ShoppingCart, Plus, Minus, Star } from 'lucide-react'
import {
  fetchProductById, selectCurrentProduct, selectProductsLoading, selectProductsError,
} from '@/features/products/productsSlice'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice, discountPercent } from '@/utils/formatters'
import StarRating from '@/components/shared/StarRating'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { productService } from '@/services/productService'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id }      = useParams()
  const dispatch    = useDispatch()
  const product     = useSelector(selectCurrentProduct)
  const loading     = useSelector(selectProductsLoading)
  const error       = useSelector(selectProductsError)
  const { addItem, getItemQuantity, changeQuantity } = useCart()
  const { isAuthenticated } = useAuth()

  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  const cartQty  = getItemQuantity(id)

  // Normalize backend product fields
  const productName = product?.name || product?.product_name || ''
  const productImages = product?.images?.length
    ? product.images
    : product?.url ? [product.url] : []
  const discount = product ? discountPercent(product.originalPrice, product.price) : 0

  useEffect(() => {
    dispatch(fetchProductById(id))
    window.scrollTo(0, 0)
  }, [id, dispatch])

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < qty; i++) addItem(product)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error('Please login to leave a review')
    setSubmitting(true)
    try {
      await productService.addReview(id, { rating: reviewRating, comment: reviewText })
      toast.success('Review submitted!')
      setReviewText('')
      dispatch(fetchProductById(id))
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />
  if (error || !product) return (
    <div className="page-container py-20 text-center">
      <p className="text-gray-500">Product not found.</p>
      <Link to="/shop" className="mt-4 inline-block text-brand-900 hover:underline">Back to Shop</Link>
    </div>
  )

  return (
    <div className="page-container py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-brand-900">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-brand-900">Shop</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{productName}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <img
              src={productImages[activeImg] || '/placeholder-fruit.jpg'}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {productImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-brand-900' : 'border-transparent'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Category is a plain string from backend */}
          {product.category && (
            <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{productName}</h1>

          <div className="flex items-center gap-3 mb-5">
            <StarRating rating={product.averageRating || 0} size={18} />
            <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
            {product.stock > 0
              ? <Badge color="green">In Stock ({product.stock} left)</Badge>
              : <Badge color="red">Out of Stock</Badge>
            }
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-brand-900">{formatPrice(product.price)}</span>
            {product.unit && <span className="text-gray-500 text-sm">per {product.unit}</span>}
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <Badge color="red">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">{product.description}</p>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2.5">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-gray-600 hover:text-brand-900">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="text-gray-600 hover:text-brand-900">
                  <Plus size={16} />
                </button>
              </div>
              <Button onClick={handleAddToCart} size="lg" fullWidth>
                <ShoppingCart size={18} />
                {cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}
              </Button>
            </div>
          )}

          {/* Meta */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-800 rounded-full text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Review list */}
          <div className="space-y-5">
            {(product.reviews || []).length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
            ) : (
              product.reviews.map((r, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.user?.name || 'Anonymous'}</p>
                      <StarRating rating={r.rating} size={14} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Review form */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
            {!isAuthenticated ? (
              <p className="text-sm text-gray-500">
                <Link to="/login" className="text-brand-900 font-medium hover:underline">Login</Link> to leave a review.
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <StarRating rating={reviewRating} size={24} interactive onChange={setReviewRating} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                    placeholder="Share your experience…"
                  />
                </div>
                <Button type="submit" loading={submitting} fullWidth>Submit Review</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
