type ToastType = 'success' | 'warning' | 'info' | 'error'
type ToastProps = {
  id: number
  message: string
  type: ToastType
}

export type { ToastProps, ToastType }
