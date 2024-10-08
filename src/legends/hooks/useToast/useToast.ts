import { useContext } from 'react'

import { ToastContext } from '@legends/contexts/toastsContext'

export default function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastControllerState must be used within a ToastsControllerStateContext')
  }

  return context
}
