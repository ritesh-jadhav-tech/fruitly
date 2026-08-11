import { Star } from 'lucide-react'
import { clsx } from 'clsx'

export default function StarRating({ rating = 0, maxStars = 5, size = 16, interactive = false, onChange }) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={clsx(
            'transition-colors',
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200',
            interactive && 'cursor-pointer hover:fill-amber-300 hover:text-amber-300'
          )}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  )
}
