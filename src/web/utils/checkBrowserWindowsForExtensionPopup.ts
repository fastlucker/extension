interface ReturnType {
  extensionPopupExists: boolean
  windowId?: number
}

export async function checkBrowserWindowsForExtensionPopup(): Promise<ReturnType> {
  const windows = await browser.windows.getAll({ populate: true })

  const result: ReturnType = { extensionPopupExists: false }
  for (const window of windows) {
    if (
      window.type === 'popup' &&
      window?.tabs?.some((tab) => tab?.url?.includes(process.env.BROWSER_EXTENSION_ID || ''))
    ) {
      result.extensionPopupExists = true
      result.windowId = window.id
    }
  }

  return result
}
