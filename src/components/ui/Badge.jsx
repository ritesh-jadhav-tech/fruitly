import { clsx } from 'clsx'

const colorMap = {
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  gray:   'bg-gray-100 text-gray-700',
  amber:  'bg-amber-100 text-amber-800',
  brand:  'bg-brand-100 text-brand-800',
}

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', colorMap[color], className)}>
      {children}
    </span>
  )
}
