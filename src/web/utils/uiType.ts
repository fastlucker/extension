import { isWeb } from '@common/config/env'
import { isExtension } from '@web/constants/browserapi'

type UiType = 'index' | 'tab' | 'action-window'

const UI_TYPE: { [key: string]: UiType } = {
  Tab: 'tab',
  Popup: 'index',
  ActionWindow: 'action-window'
}

type UiTypeCheck = {
  isTab: boolean
  isActionWindow: boolean
  isPopup: boolean
}

export const getUiType = (): UiTypeCheck => {
  if (!isWeb) {
    return { isActionWindow: false, isPopup: false, isTab: false }
  }

  if (isWeb && !isExtension) {
    return { isActionWindow: false, isPopup: false, isTab: true }
  }

  const { pathname } = window.location
  return Object.entries(UI_TYPE).reduce((m, [key, value]) => {
    m[`is${key}`] = pathname === `/${value}.html`

    return m
  }, {} as UiTypeCheck)
}
