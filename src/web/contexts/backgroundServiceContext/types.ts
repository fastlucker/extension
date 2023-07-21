import { MainController } from 'ambire-common/src/controllers/main/main'

import { WalletController } from '@web/extension-services/background/wallet'

export type BackgroundServiceContextReturnType = {
  mainCtrl: MainController
  wallet: WalletController
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  mainCtrl: null,
  wallet: null
}
