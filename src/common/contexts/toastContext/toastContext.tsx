import { ToastType, UseToastsOptions, UseToastsReturnType } from 'ambire-common/src/hooks/useToasts'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CheckIcon from '@common/assets/svg/CheckIcon'
import CloseIconRound from '@common/assets/svg/CloseIconRound'
import ErrorIcon from '@common/assets/svg/ErrorIcon'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import { TAB_BAR_HEIGHT } from '@common/constants/router'
import { navigationRef } from '@common/services/navigation'
import { isRouteWithTabBar } from '@common/services/router'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { Portal } from '@gorhom/portal'

import styles from './styles'

const ToastContext = React.createContext<UseToastsReturnType>({
  addToast: () => -1,
  removeToast: () => {}
})

const defaultOptions: Partial<UseToastsOptions> = {
  timeout: 8000,
  error: false,
  sticky: false
}

let id = 0

const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([])
  const [hasTabBar, setHasTabBar] = useState(false)
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  useEffect(() => {
    // TODO: Temporarily assume that always has tab bar, since the notification
    // position will be anyways different in the upcoming versions.
    if (isWeb) {
      setHasTabBar(true)
      return
    }

    let intervalAttemptingToSubscribe: ReturnType<typeof setInterval>
    let navigationRefSubscription = () => {}

    const setNavigationRefSubscription = () => {
      if (!navigationRef?.current?.isReady()) return

      const triggerSetHasTabBar = () => {
        const routeName = navigationRef?.current?.getCurrentRoute()?.name

        setHasTabBar(isRouteWithTabBar(routeName as string))
      }

      // Set the tab bar flag for the current state (route)
      triggerSetHasTabBar()
      // Update the tab bar flag when the navigator's state changes
      navigationRefSubscription = navigationRef?.current?.addListener('state', triggerSetHasTabBar)

      // Once the initial calculation + the subscription are set, the interval jon has done.
      clearInterval(intervalAttemptingToSubscribe)
    }

    intervalAttemptingToSubscribe = setInterval(setNavigationRefSubscription, 500)
    // Trigger immediately on purpose, because you never know when the
    // navigation ref will be ready (navigationRef?.current?.isReady()).
    // Might happen almost immediately (for the mobile app),
    // or with a slight delay (for the web extension).
    setNavigationRefSubscription()

    return () => {
      clearInterval(intervalAttemptingToSubscribe)
      navigationRefSubscription() // unsubscribe
    }
  }, [])

  const removeToast = useCallback<UseToastsReturnType['removeToast']>((tId) => {
    setToasts((_toasts) => _toasts.filter((_t) => _t.id !== tId))
  }, [])

  const addToast = useCallback<UseToastsReturnType['addToast']>(
    (text, options) => {
      const toast: ToastType = {
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
    (_id: ToastType['id'], onClick?: ToastType['onClick'], url?: ToastType['url']) => {
      if (url) Linking.openURL(url)
      onClick ? onClick() : removeToast(_id)
    },
    [removeToast]
  )

  // -4 is a magic number
  // 44 is the height of the bottom tab navigation
  const tabBarHeight = hasTabBar ? TAB_BAR_HEIGHT : 0
  const bottomInset =
    insets.bottom > 0 ? insets.bottom - 4 + tabBarHeight : insets.bottom + tabBarHeight

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
        <View style={[styles.container, { bottom: bottomInset }]}>
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {[...toasts].reverse().map(({ id, url, error, sticky, badge, text, onClick }) => (
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
                  <Text weight="medium" color={colors.patriotBlue} fontSize={12}>
                    {error ? t('Oops') : t('Success')}
                  </Text>
                  <Text numberOfLines={7} color={colors.patriotBlue} fontSize={12}>
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
