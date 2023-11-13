import { MainController } from '@ambire-common/controllers/main/main'

import { controllersMapping } from './types'

const transferCtrlHandler = (mainCtrl: MainController) => {
  if (mainCtrl.transfer.userRequest) {
    mainCtrl.addUserRequest(mainCtrl.transfer.userRequest)
    mainCtrl.transfer.reset()
  }
}

export const nestedControllersOnUpdateHandlers = (
  mainCtrl: MainController,
  ctrlName: keyof typeof controllersMapping
) => {
  if (ctrlName === 'transfer') {
    transferCtrlHandler(mainCtrl)
  }
}
