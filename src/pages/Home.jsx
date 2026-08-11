import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRight, Truck, RefreshCw, Shield, Leaf } from 'lucide-react'
import { fetchFeaturedProducts, selectFeaturedProducts, selectProductsLoading } from '@/features/products/productsSlice'
import { fetchCategories, selectCategories } from '@/features/categories/categoriesSlice'
import ProductCard from '@/components/shared/ProductCard'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const features = [
  { icon: Truck,     title: 'Free Delivery',    desc: 'On orders above ₹499' },
  { icon: Leaf,      title: '100% Organic',     desc: 'Farm fresh guarantee' },
  { icon: RefreshCw, title: 'Easy Returns',     desc: '24-hour return policy' },
  { icon: Shield,    title: 'Safe Payments',    desc: 'Secure checkout always' },
]

export default function Home() {
  const dispatch  = useDispatch()
  const featured  = useSelector(selectFeaturedProducts)
  const categories= useSelector(selectCategories)
  const loading   = useSelector(selectProductsLoading)

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="absolute inset-0 opacity-10 text-[200px] leading-none select-none pointer-events-none overflow-hidden">
          🍊🍋🍇🍓🥝
        </div>
        <div className="page-container relative py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-sm font-semibold mb-5 border border-amber-400/30">
              🌿 Farm to Doorstep
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Fresh Fruits,<br />
              <span className="text-amber-400">Delivered Daily.</span>
            </h1>
            <p className="text-brand-200 text-lg mb-8 max-w-md">
              Handpicked from the finest farms across India. Order by 9 AM and get same-day delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button size="lg" variant="amber">
                  Shop Now <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/shop?category=featured">
                <Button size="lg" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
                  View Offers
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 text-center text-[140px] md:text-[180px] leading-none hidden md:block select-none">
            🍊
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="page-container py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 page-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900 flex items-center gap-1">
              All categories <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group card p-4 text-center hover:shadow-card-hover transition-shadow"
              >
                <div className="text-4xl mb-3">🍎</div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-900 transition-colors">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Featured Picks</h2>
            <Link to="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900 flex items-center gap-1">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
              {featured.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button variant="secondary" size="lg">Browse All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 page-container">
        <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Get 20% off your first order!</h3>
            <p className="text-amber-100">Use code <strong className="text-white">FRESH20</strong> at checkout.</p>
          </div>
          <Link to="/register">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 whitespace-nowrap">
              Claim Offer
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
