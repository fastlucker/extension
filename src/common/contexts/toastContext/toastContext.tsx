import React, { useCallback, useMemo, useState } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CheckIcon from '@common/assets/svg/CheckIcon'
import CloseIconRound from '@common/assets/svg/CloseIconRound'
import ErrorIcon from '@common/assets/svg/ErrorIcon'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { HEADER_HEIGHT } from '@common/modules/header/components/Header/styles'
import colors from '@common/styles/colors'
import spacings, { SPACING_MD, SPACING_TY } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { Portal } from '@gorhom/portal'

import styles from './styles'

// Magic spacing for positioning the toast list
// to match exactly the area of the header + its bottom spacing
const ADDITIONAL_TOP_SPACING_MOBILE = SPACING_TY
const ADDITIONAL_TOP_SPACING_WEB = SPACING_MD

const ToastContext = React.createContext({
  addToast: () => -1,
  removeToast: () => {}
})

const defaultOptions = {
  timeout: 8000,
  error: false,
  sticky: false
}

let id = 0

const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<any[]>([])
  const insets = useSafeAreaInsets()

  const removeToast = useCallback((tId) => {
    setToasts((_toasts) => _toasts.filter((_t) => _t.id !== tId))
  }, [])

  const addToast = useCallback(
    (text, options) => {
      const toast = {
        id: id++,
        text,
        ...defaultOptions,
        ...options
      }

      setToasts((_toasts) => [..._toasts, toast])

      !toast.sticky && setTimeout(() => removeToast(toast.id), toast.timeout)

      return toast.id
    },
    [setToasts, removeToast]
  )

  const onToastPress = useCallback(
    (_id, onClick?, url?) => {
      if (url) Linking.openURL(url)
      onClick ? onClick() : removeToast(_id)
    },
    [removeToast]
  )

  const topInset =
    insets.top +
    HEADER_HEIGHT +
    (isWeb ? ADDITIONAL_TOP_SPACING_WEB : ADDITIONAL_TOP_SPACING_MOBILE)

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
      <Portal hostName="global">
        <View style={[styles.container, { top: topInset }]}>
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {toasts.map(({ id, url, error, sticky, badge, text, onClick }) => (
            <View style={styles.toastWrapper} key={id}>
              <TouchableOpacity
                style={[styles.toast, error && styles.error]}
                onPress={() => onToastPress(id, onClick, url)}
                activeOpacity={0.9}
              >
                {!!badge && (
                  <View style={[styles.badge, spacings.mrTy, error && styles.errorBadge]}>
                    <Text fontSize={10} weight="medium" color={colors.white}>
                      {badge}
                    </Text>
                  </View>
                )}
                {!badge && (
                  <View style={spacings.prTy}>{error ? <ErrorIcon /> : <CheckIcon />}</View>
                )}
                <View style={flexboxStyles.flex1}>
                  <Text numberOfLines={7} color={colors.patriotBlue} weight="regular" fontSize={12}>
                    {text}
                  </Text>
                </View>
                {!!sticky && (
                  <TouchableOpacity style={spacings.plTy} onPress={() => removeToast(id)}>
                    <CloseIconRound color={error ? colors.pink : colors.turquoise} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Portal>
      {children}
    </ToastContext.Provider>
  )
}

export { ToastContext, ToastProvider }
