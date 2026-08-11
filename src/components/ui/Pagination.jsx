import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-sm text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={clsx(
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              p === page
                ? 'bg-brand-900 text-white'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
