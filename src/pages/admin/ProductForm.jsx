import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Upload, X } from 'lucide-react'
import {
  createProduct, updateProduct, fetchProductById,
  selectCurrentProduct, selectProductsLoading, clearCurrentProduct,
} from '@/features/products/productsSlice'
import { fetchCategories, selectCategories } from '@/features/categories/categoriesSlice'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

const UNITS = ['kg', 'g', 'dozen', 'piece', 'pack', 'litre', 'bunch']

export default function ProductForm() {
  const { id }     = useParams()
  const isEdit     = !!id
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const product    = useSelector(selectCurrentProduct)
  const loading    = useSelector(selectProductsLoading)
  const categories = useSelector(selectCategories)

  const [form, setForm] = useState({
    name:        '',   // maps to backend "name" field → stored as product_name
    description: '',
    price:       '',
    stock:       '',
    category:    '',
    brand:       '',
    unit:        'kg',
  })
  const [imageFile,    setImageFile]    = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors]            = useState({})
  const [saving, setSaving]            = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
    if (isEdit) dispatch(fetchProductById(id))
    return () => dispatch(clearCurrentProduct())
  }, [id, isEdit, dispatch])

  // Populate form when editing
  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name:        product.name || product.product_name || '',
        description: product.description || '',
        price:       product.price || '',
        stock:       product.stock || '',
        category:    product.category || '',
        brand:       product.brand || '',
        unit:        product.unit || 'kg',
      })
      // Show existing image
      const img = product.images?.[0] || product.url || null
      if (img) setImagePreview(img)
    }
  }, [product, isEdit])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Product name is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price is required'
    if (!form.category.trim()) e.category = 'Category is required'
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock quantity required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    try {
      if (isEdit) {
        // Update via PUT /data/update — sends JSON body
        const updatePayload = {
          _id:          id,
          product_name: form.name.trim(),
          description:  form.description.trim(),
          price:        Number(form.price),
          stock:        Number(form.stock),
          category:     form.category.trim(),
          brand:        form.brand.trim(),
          unit:         form.unit,
        }
        const result = await dispatch(updateProduct({ id, formData: updatePayload }))
        if (updateProduct.fulfilled.match(result)) {
          toast.success('Product updated!')
          navigate('/admin/products')
        } else {
          toast.error(result.payload || 'Update failed')
        }
      } else {
        // Create via POST /file/uplode — requires an image file
        if (!imageFile) { toast.error('Please select a product image'); setSaving(false); return }
        const fd = new FormData()
        fd.append('image',       imageFile)
        fd.append('name',        form.name.trim())
        fd.append('description', form.description.trim())
        fd.append('price',       form.price)
        fd.append('stock',       form.stock)
        fd.append('category',    form.category.trim())
        fd.append('brand',       form.brand.trim())
        fd.append('unit',        form.unit)

        const result = await dispatch(createProduct(fd))
        if (createProduct.fulfilled.match(result)) {
          toast.success('Product created!')
          navigate('/admin/products')
        } else {
          toast.error(result.payload || 'Create failed')
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  if (isEdit && loading && !product) return <PageSpinner />

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/products"
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500">{isEdit ? `Editing: ${product?.name || product?.product_name}` : 'Fill in the details below'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-gray-900">Basic Information</h2>
          <Input
            label="Product Name" required
            value={form.name} error={errors.name}
            placeholder="e.g., Fresh Alphonso Mangoes"
            onChange={set('name')}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 placeholder:text-gray-400 transition-all"
              placeholder="Describe the fruit, its origin, taste, and benefits…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand (optional)</label>
            <input
              value={form.brand}
              onChange={set('brand')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
              placeholder="e.g., Organic Farms"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-gray-900">Pricing & Inventory</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Selling Price (₹)" type="number" required min="0" step="0.01"
              value={form.price} error={errors.price}
              placeholder="e.g., 120"
              onChange={set('price')}
            />
            <Input
              label="Stock Quantity" type="number" required min="0"
              value={form.stock} error={errors.stock}
              placeholder="e.g., 100"
              onChange={set('stock')}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select value={form.unit} onChange={set('unit')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Category</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            {/* Allow both selecting from existing or typing a new one */}
            <div className="flex gap-2">
              <select value={form.category} onChange={set('category')}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white
                  ${errors.category ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-700'}`}>
                <option value="">Select or type a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <input
              value={form.category}
              onChange={set('category')}
              className={`mt-2 w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2
                ${errors.category ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-700'}`}
              placeholder="Or type a new category (e.g., Fruits, Vegetables)"
            />
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>
        </div>

        {/* Image */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Product Image</h2>
          {imagePreview && (
            <div className="relative w-32 h-32">
              <img src={imagePreview} alt="" className="w-full h-full rounded-xl object-cover border border-gray-200" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm">
                <X size={12} />
              </button>
            </div>
          )}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">
            <Upload size={24} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-600">
              {isEdit ? 'Click to replace image (optional)' : 'Click to upload image *'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {!isEdit && !imageFile && (
            <p className="text-xs text-amber-600">⚠ An image is required when creating a new product (uploaded to Cloudinary)</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" loading={saving}>
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Link to="/admin/products">
            <Button variant="secondary" size="lg" type="button">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
