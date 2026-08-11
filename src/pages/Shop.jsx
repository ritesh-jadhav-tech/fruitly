import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import {
  fetchProducts, selectProducts, selectProductsLoading,
  selectProductFilters, selectProductsPaging, setFilters, setPage, resetFilters,
} from '@/features/products/productsSlice'
import { fetchCategories, selectCategories } from '@/features/categories/categoriesSlice'
import ProductCard from '@/components/shared/ProductCard'
import SearchBar   from '@/components/shared/SearchBar'
import Pagination  from '@/components/ui/Pagination'
import EmptyState  from '@/components/ui/EmptyState'
import Spinner     from '@/components/ui/Spinner'
import { SORT_OPTIONS } from '@/utils/constants'
import { Package } from 'lucide-react'

export default function Shop() {
  const dispatch    = useDispatch()
  const [params]    = useSearchParams()
  const products    = useSelector(selectProducts)
  const loading     = useSelector(selectProductsLoading)
  const filters     = useSelector(selectProductFilters)
  const paging      = useSelector(selectProductsPaging)
  const categories  = useSelector(selectCategories)
  const [showFilters, setShowFilters] = useState(false)

  // Sync URL params → redux filters on mount
  useEffect(() => {
    const urlSearch   = params.get('search')   || ''
    const urlCategory = params.get('category') || ''
    if (urlSearch || urlCategory) {
      dispatch(setFilters({ search: urlSearch, category: urlCategory }))
    }
    dispatch(fetchCategories())
  }, []) // eslint-disable-line

  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const handleSearch   = (search)   => dispatch(setFilters({ search }))
  const handleCategory = (category) => dispatch(setFilters({ category }))
  const handleSort     = (sort)     => dispatch(setFilters({ sort }))
  const handlePrice    = (field, v) => dispatch(setFilters({ [field]: v }))
  const handlePage     = (page)     => { dispatch(setPage(page)); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const activeFilters = [
    filters.search   && { label: `"${filters.search}"`, clear: () => dispatch(setFilters({ search: '' })) },
    // categories._id === category name string from backend
    filters.category && { label: filters.category, clear: () => dispatch(setFilters({ category: '' })) },
    (filters.minPrice||filters.maxPrice) && { label: `₹${filters.minPrice||0}–${filters.maxPrice||'∞'}`, clear: () => dispatch(setFilters({ minPrice:'', maxPrice:'' })) },
  ].filter(Boolean)

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Fresh Fruits</h1>
          <p className="text-sm text-gray-500 mt-1">{paging.total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar initialValue={filters.search} onSearch={handleSearch} className="w-60" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 bg-brand-900 text-white text-[10px] rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
          <select
            value={filters.sort}
            onChange={(e) => handleSort(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs text-gray-500 font-medium">Active filters:</span>
          {activeFilters.map((f, i) => (
            <button key={i} onClick={f.clear}
              className="flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-medium hover:bg-brand-200 transition-colors">
              {f.label} <X size={12} />
            </button>
          ))}
          <button onClick={() => dispatch(resetFilters())}
            className="px-3 py-1 text-xs text-red-600 hover:text-red-800 font-medium">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar filters */}
        {showFilters && (
          <aside className="hidden md:block w-56 flex-shrink-0 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cat" checked={!filters.category}
                    onChange={() => handleCategory('')} className="accent-brand-900" />
                  <span className="text-sm text-gray-700">All</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                    {/* cat._id === cat.name for string-based categories */}
                    <input type="radio" name="cat" checked={filters.category === cat.name}
                      onChange={() => handleCategory(cat.name)} className="accent-brand-900" />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range (₹)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handlePrice('minPrice', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handlePrice('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>
            </div>
          </aside>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="xl" /></div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try adjusting your search or filters."
              actionLabel="Clear Filters"
              onAction={() => dispatch(resetFilters())}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={filters.page} totalPages={paging.totalPages} onPageChange={handlePage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
