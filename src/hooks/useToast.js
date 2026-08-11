import toast from 'react-hot-toast'

export const useToast = () => {
  const success = (msg)  => toast.success(msg)
  const error   = (msg)  => toast.error(msg)
  const info    = (msg)  => toast(msg, { icon: 'ℹ️' })
  const warn    = (msg)  => toast(msg, { icon: '⚠️' })
  const loading = (msg)  => toast.loading(msg)
  const dismiss = (id)   => toast.dismiss(id)
  const promise = (pr, msgs) => toast.promise(pr, msgs)

  return { success, error, info, warn, loading, dismiss, promise }
}
