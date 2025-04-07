import { MainController } from '@ambire-common/controllers/main/main'
import { ONBOARDING_WEB_ROUTES } from '@common/modules/router/constants/common'
import { Port } from '@web/extension-services/messengers'

export const handleCleanUpOnPortDisconnect = async ({
  port,
  mainCtrl
}: {
  port: Port
  mainCtrl: MainController
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
      await mainCtrl.accountPicker.reset()
    }
  }
}
