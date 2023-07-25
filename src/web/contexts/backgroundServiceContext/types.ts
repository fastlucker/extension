import { MainControllerMethods } from '@web/extension-services/background/main'
import { WalletController } from '@web/extension-services/background/wallet'

export type BackgroundServiceContextReturnType = {
  mainCtrl: MainControllerMethods
  wallet: WalletController
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  mainCtrl: null,
  wallet: null
}
