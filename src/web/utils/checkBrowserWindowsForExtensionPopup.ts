import { browserAPI } from '@web/constants/browserapi'

interface ReturnType {
  extensionPopupExists: boolean
  windowId?: number
}

export async function checkBrowserWindowsForExtensionPopup(): Promise<ReturnType> {
  const windows = await browserAPI.windows.getAll({ populate: true })

  const result: ReturnType = { extensionPopupExists: false }
  windows.forEach((window) => {
    if (
      window.type === 'popup' &&
      window?.tabs?.some((tab) => tab?.url?.includes(browserAPI.runtime.id))
    ) {
      result.extensionPopupExists = true
      result.windowId = window.id
    }
  })

  return result
}
