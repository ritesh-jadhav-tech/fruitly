import Button from './Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-5">
          <Icon size={36} className="text-brand-700" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
