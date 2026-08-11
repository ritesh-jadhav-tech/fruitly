import { clsx } from 'clsx'
import Spinner from './Spinner'

const variants = {
  primary:   'bg-brand-900 text-white hover:bg-brand-800 focus:ring-brand-700',
  secondary: 'border border-brand-900 text-brand-900 hover:bg-brand-50 focus:ring-brand-700',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost:     'text-brand-900 hover:bg-brand-50 focus:ring-brand-700',
  amber:     'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400',
}

const sizes = {
  sm:  'px-3 py-1.5 text-xs',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-3 text-base',
  xl:  'px-9 py-4 text-lg',
  icon:'p-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150',
        'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" color={variant === 'secondary' ? 'brand' : 'white'} />}
      {children}
    </button>
  )
}
