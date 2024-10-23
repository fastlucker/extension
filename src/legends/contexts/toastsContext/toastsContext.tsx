import React, { createContext, FC, useCallback, useMemo, useReducer } from 'react'

import ToastsContainer from './ToastContainer'
import { ToastProps, ToastType } from './types'

const toastReducer = (
  state: { toasts: ToastProps[] },
  action:
    | {
        type: 'ADD_TOAST'
        payload: ToastProps
      }
    | {
        type: 'DISMISS_TOAST'
        payload: ToastProps['id']
      }
) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      }
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload)
      }
    default:
      throw new Error('Unhandled action type')
  }
}

const ToastContext = createContext<{
  addToast: (message: string, type?: ToastType) => void
  dismissToast: (id: number) => void
}>({
  addToast: () => {},
  dismissToast: () => {}
})

const ToastContextProvider: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.floor(Math.random() * 10000000)
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } })
  }, [])

  const dismissToast = useCallback((id: number) => {
    dispatch({ type: 'DISMISS_TOAST', payload: id })
  }, [])

  const value = useMemo(() => ({ addToast, dismissToast }), [addToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      <ToastsContainer toasts={state.toasts} />
      {children}
    </ToastContext.Provider>
  )
}

export { ToastContext, ToastContextProvider }
