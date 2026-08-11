import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Search, Users, Shield, ShieldOff, Trash2, UserCheck, UserX } from 'lucide-react'
import { userService } from '@/services/userService'
import { openConfirmDialog } from '@/features/ui/uiSlice'
import { formatDate, getInitials } from '@/utils/formatters'
import Badge      from '@/components/ui/Badge'
import Button     from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function UsersManagement() {
  const dispatch = useDispatch()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total,   setTotal]   = useState(0)

  const loadUsers = async (p = page, q = search) => {
    setLoading(true)
    try {
      const { data } = await userService.getAll({ page: p, limit: 15, search: q })
      setUsers(data.users)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadUsers(1, search)
  }

  const handleToggleRole = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    dispatch(openConfirmDialog({
      title:   `${newRole === 'admin' ? 'Promote' : 'Demote'} User`,
      message: `Change ${user.name}'s role to "${newRole}"?`,
      onConfirm: async () => {
        try {
          await userService.update(user._id, { role: newRole })
          toast.success(`Role updated to ${newRole}`)
          loadUsers()
        } catch {
          toast.error('Failed to update role')
        }
      },
    }))
  }

  const handleToggleActive = (user) => {
    const newStatus = !user.isActive
    dispatch(openConfirmDialog({
      title:   `${newStatus ? 'Activate' : 'Deactivate'} Account`,
      message: `${newStatus ? 'Activate' : 'Deactivate'} ${user.name}'s account?`,
      onConfirm: async () => {
        try {
          await userService.update(user._id, { isActive: newStatus })
          toast.success(`Account ${newStatus ? 'activated' : 'deactivated'}`)
          loadUsers()
        } catch {
          toast.error('Failed to update status')
        }
      },
    }))
  }

  const handleDelete = (user) => {
    dispatch(openConfirmDialog({
      title:   'Delete User',
      message: `Permanently delete ${user.name}'s account? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await userService.remove(user._id)
          toast.success('User deleted')
          loadUsers()
        } catch {
          toast.error('Failed to delete user')
        }
      },
    }))
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
        />
      </form>

      {loading ? (
        <PageSpinner />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="No users match your search." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="py-4 px-4">
                        <Badge color={user.role === 'admin' ? 'purple' : 'brand'}>
                          {user.role === 'admin' ? '👑 Admin' : 'Customer'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge color={user.isActive !== false ? 'green' : 'red'}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle role */}
                          <button
                            onClick={() => handleToggleRole(user)}
                            title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                            className="p-2 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            {user.role === 'admin' ? <ShieldOff size={15} /> : <Shield size={15} />}
                          </button>
                          {/* Toggle active */}
                          <button
                            onClick={() => handleToggleActive(user)}
                            title={user.isActive !== false ? 'Deactivate' : 'Activate'}
                            className="p-2 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
                          >
                            {user.isActive !== false ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); loadUsers(p) }}
            />
          </div>
        </>
      )}
    </div>
  )
}
