import { MainController } from '@ambire-common/controllers/main/main'
import { ONBOARDING_WEB_ROUTES } from '@common/modules/router/constants/common'
import { Port } from '@web/extension-services/messengers'

export const handleCleanUpOnPortDisconnect = async ({
  port,
  mainCtrl,
  getAllPorts
}: {
  port: Port
  mainCtrl: MainController
  getAllPorts: () => Port[]
}) => {
  if (!port.sender || !port.sender?.url) return

  const url = new URL(port.sender.url)

  if (port.sender.url?.includes('sessionId')) {
    const sessionId = url.searchParams.get('sessionId')!

    if (url.pathname.includes('swap-and-bridge')) {
      mainCtrl.swapAndBridge.unloadScreen(sessionId)
    }

    if (url.pathname.includes('dashboard') || url.pathname.includes('transactions')) {
      mainCtrl.activity.resetAccountsOpsFilters(sessionId)
    }

    if (url.pathname.includes('signed-messages')) {
      mainCtrl.activity.resetSignedMessagesFilters(sessionId)
    }
  }

  if (url.pathname.includes('sign-account-op')) {
    mainCtrl.destroySignAccOp()
  }

  if (url.pathname.includes('sign-message')) {
    mainCtrl.signMessage.reset()
  }

  if (mainCtrl.accountPicker.isInitialized) {
    const shouldResetAccountAdder = ONBOARDING_WEB_ROUTES.some((r) => url.pathname.includes(r))

    if (shouldResetAccountAdder) {
      setTimeout(async () => {
        // If a port with the same URL appears within 500ms, it's likely a page reload.
        // In that case, skip resetting the accountPicker.
        const ports = getAllPorts()

        if (
          !ports.some((p) => {
            if (!p.sender || !p.sender?.url) return false
            const portUrl = new URL(p.sender.url)

            return portUrl.pathname === url.pathname
          })
        ) {
          await mainCtrl.accountPicker.reset()
        }
      }, 500)
    }
  }
}
