import { useContext } from 'react'

import { ToastContext } from '@modules/common/contexts/toastContext'

export default function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within an ToastContext')
  }

  return context
}
