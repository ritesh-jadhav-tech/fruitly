import { useSelector, useDispatch } from 'react-redux'
import { selectConfirmDialog, closeConfirmDialog } from '@/features/ui/uiSlice'
import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog() {
  const dispatch = useDispatch()
  const { isOpen, title, message, onConfirm } = useSelector(selectConfirmDialog)

  const handleConfirm = () => {
    onConfirm?.()
    dispatch(closeConfirmDialog())
  }

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeConfirmDialog())} title={title || 'Are you sure?'} size="sm">
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={() => dispatch(closeConfirmDialog())}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}
