import { MainController } from '@ambire-common/controllers/main/main'
import { Port } from '@web/extension-services/messengers'

export const handleControllersSessionCleanup = ({
  port,
  mainCtrl
}: {
  port: Port
  mainCtrl: MainController
}) => {
  if (!port.sender) return

  if (port.sender.url?.includes('sessionId')) {
    const url = new URL(port.sender.url)
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
}
