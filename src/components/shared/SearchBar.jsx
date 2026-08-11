import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search fruits…', className = '' }) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query.trim())
    } else {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const clear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('relative', className)}>
      <Search
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm
                   focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent
                   bg-white placeholder:text-gray-400"
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={15} />
        </button>
      )}
    </form>
  )
}
