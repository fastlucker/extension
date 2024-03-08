import { isWeb } from '@common/config/env'
import { isExtension } from '@web/constants/browserapi'

type UiType = 'tab' | 'notification' | 'index'

const UI_TYPE: { [key: string]: UiType } = {
  Tab: 'tab',
  Popup: 'index',
  Notification: 'notification'
}

type UiTypeCheck = {
  isTab: boolean
  isNotification: boolean
  isPopup: boolean
}

export const getUiType = (): UiTypeCheck => {
  if (!isWeb) {
    return { isNotification: false, isPopup: false, isTab: false }
  }

  if (isWeb && !isExtension) {
    return { isNotification: false, isPopup: false, isTab: true }
  }

  const { pathname } = window.location
  return Object.entries(UI_TYPE).reduce((m, [key, value]) => {
    m[`is${key}`] = pathname === `/${value}.html`

    return m
  }, {} as UiTypeCheck)
}
