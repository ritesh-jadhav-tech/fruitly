import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tag } from 'lucide-react'
import {
  fetchCategories,
  selectCategories, selectCategoriesLoading,
} from '@/features/categories/categoriesSlice'
import EmptyState from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'

export default function CategoriesManagement() {
  const dispatch    = useDispatch()
  const categories  = useSelector(selectCategories)
  const loading     = useSelector(selectCategoriesLoading)

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  if (loading) return <PageSpinner />

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            {categories.length} categories. Categories are automatically derived from products.
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No categories yet"
          description="Categories will appear here once you add products with category tags."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div key={cat._id} className="card p-5 group hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">🍎</div>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
