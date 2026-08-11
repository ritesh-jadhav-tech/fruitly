import { clsx } from 'clsx'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, helperText, leftIcon, rightIcon, className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-lg border text-sm transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400',
            leftIcon  ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : 'pr-4',
            'py-2.5',
            error
              ? 'border-red-400 focus:ring-red-400 bg-red-50'
              : 'border-gray-300 focus:ring-brand-700 bg-white',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error      && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  )
})

export default Input
