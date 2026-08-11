import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🍋</div>
        <h1 className="text-6xl font-extrabold text-brand-900 mb-3">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"><Button size="lg">Go Home</Button></Link>
          <Link to="/shop"><Button size="lg" variant="secondary">Browse Shop</Button></Link>
        </div>
      </div>
    </div>
  )
}
