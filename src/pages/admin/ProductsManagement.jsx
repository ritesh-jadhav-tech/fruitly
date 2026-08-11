import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import {
  fetchProducts, deleteProduct,
  selectProducts, selectProductsLoading, selectProductsPaging,
  setFilters, setPage,
} from '@/features/products/productsSlice'
import { useDispatch as useAppDispatch } from 'react-redux'
import { openConfirmDialog } from '@/features/ui/uiSlice'
import { formatPrice } from '@/utils/formatters'
import Button      from '@/components/ui/Button'
import Badge       from '@/components/ui/Badge'
import Pagination  from '@/components/ui/Pagination'
import EmptyState  from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ProductsManagement() {
  const dispatch   = useDispatch()
  const products   = useSelector(selectProducts)
  const loading    = useSelector(selectProductsLoading)
  const paging     = useSelector(selectProductsPaging)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 15 }))
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search }))
    dispatch(fetchProducts({ search, page: 1, limit: 15 }))
  }

  const handleDelete = (product) => {
    dispatch(openConfirmDialog({
      title:   'Delete Product',
      message: `Are you sure you want to delete "${product.name}"? This cannot be undone.`,
      onConfirm: async () => {
        const result = await dispatch(deleteProduct({ id: product._id, public_id: product.public_id }))
        if (deleteProduct.fulfilled.match(result)) {
          toast.success('Product deleted')
        } else {
          toast.error('Failed to delete product')
        }
      },
    }))
  }

  const handlePage = (page) => {
    dispatch(fetchProducts({ search, page, limit: 15 }))
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{paging.total} total products</p>
        </div>
        <Link to="/admin/products/new">
          <Button><Plus size={16} /> Add Product</Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
      </form>

      {loading ? (
        <PageSpinner />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Add your first product to get started."
          actionLabel="Add Product"
          onAction={() => {}}
        />
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || '/placeholder-fruit.jpg'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[180px]">{product.name}</p>
                            <p className="text-xs text-gray-400">ID: {product._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{product.category?.name || '—'}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.unit && <span className="text-xs text-gray-400 ml-1">/{product.unit}</span>}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge color={product.stock > 0 ? 'green' : 'red'}>
                          {product.stock > 0 ? 'Active' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/products/${product._id}/edit`}>
                            <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors">
                              <Edit2 size={15} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <Pagination page={paging.page} totalPages={paging.totalPages} onPageChange={handlePage} />
          </div>
        </>
      )}
    </div>
  )
}
