import { clsx } from 'clsx'

export default function StatCard({ icon: Icon, label, value, change, color = 'brand' }) {
  const colors = {
    brand:  { bg: 'bg-brand-50',  icon: 'text-brand-700',  ring: 'ring-brand-100' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  ring: 'ring-amber-100' },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   ring: 'ring-blue-100'  },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'ring-purple-100'},
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  ring: 'ring-green-100' },
  }
  const c = colors[color] || colors.brand

  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={clsx('p-3 rounded-xl ring-1', c.bg, c.ring)}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {change !== undefined && (
          <p className={clsx('text-xs font-medium mt-1', change >= 0 ? 'text-green-600' : 'text-red-500')}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
          </p>
        )}
      </div>
    </div>
  )
}
