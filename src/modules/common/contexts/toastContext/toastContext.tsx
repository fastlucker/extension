import React, { useCallback, useMemo, useState } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'

import Text from '@modules/common/components/Text'

import styles from './styles'

type OptionsProps = {
  id?: string
  url?: string
  error?: boolean
  sticky?: boolean
  badge?: any
  onClick?: () => any
}

type ToastContextData = {
  addToast: (text: string | number, options?: OptionsProps) => any
  removeToast: (id: string) => any
}

const ToastContext = React.createContext<ToastContextData>({
  addToast: () => {},
  removeToast: () => {}
})

let id = 0

const ToastProvider = ({ children }: any) => {
  const [toasts, setToasts] = useState<any[]>([])

  const removeToast = useCallback((tId) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setToasts((toasts: any) => toasts.filter((t: any) => t.id !== tId))
  }, [])

  const addToast = useCallback(
    (text, options) => {
      const defaultOptions = {
        timeout: 8000,
        error: false,
        sticky: false,
        badge: null,
        onClick: null,
        url: null
      }

      const toast = {
        id: id++,
        text,
        ...defaultOptions,
        ...options
      }

      // eslint-disable-next-line @typescript-eslint/no-shadow
      setToasts((toasts: any) => [...toasts, toast])

      !toast.sticky && setTimeout(() => removeToast(toast.id), toast.timeout)

      return toast.id
    },
    [setToasts, removeToast]
  )

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onToastPress = (id?: string, onClick?: () => any, url?: string) => {
    if (url) Linking.openURL(url)
    onClick ? onClick() : removeToast(id)
  }

  return (
    <ToastContext.Provider
      value={useMemo(
        () => ({
          addToast,
          removeToast
        }),
        [addToast, removeToast]
      )}
    >
      <View style={styles.container}>
        {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
        {toasts.reverse().map(({ id, url, error, sticky, badge, text, onClick }) => (
          <TouchableOpacity
            key={id}
            style={StyleSheet.flatten([styles.toast, error && styles.error])}
            onPress={() => onToastPress(id, onClick, url)}
          >
            {!!badge && <View style={styles.badgeWrapper}>{badge}</View>}
            <Text style={styles.text}>{text}</Text>
            {!!sticky && (
              <TouchableOpacity style={styles.closeIcon} onPress={() => removeToast(id)}>
                <Text>❌</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {children}
    </ToastContext.Provider>
  )
}

export { ToastContext, ToastProvider }
