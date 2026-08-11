import { clsx } from 'clsx'

const sizes = {
  sm:  'w-4 h-4 border-2',
  md:  'w-8 h-8 border-2',
  lg:  'w-12 h-12 border-3',
  xl:  'w-16 h-16 border-4',
}

const colors = {
  brand: 'border-brand-900 border-t-transparent',
  white: 'border-white border-t-transparent',
  amber: 'border-amber-500 border-t-transparent',
  gray:  'border-gray-400 border-t-transparent',
}

export default function Spinner({ size = 'md', color = 'brand', className = '' }) {
  return (
    <div
      role="status"
      className={clsx('animate-spin rounded-full', sizes[size], colors[color], className)}
      aria-label="Loading"
    />
  )
}

export function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  )
}
