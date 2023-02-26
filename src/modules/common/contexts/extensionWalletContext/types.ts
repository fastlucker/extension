import { Object } from 'ts-toolbelt'

import { WalletController as WalletControllerClass } from '@web/background/wallet'

export type IExtractFromPromise<T> = T extends Promise<infer U> ? U : T

// TODO: implement here but not used now to avoid too much ts checker error.
// we will use it on almost biz store ready.
export type ExtensionWalletControllerType = Object.Merge<
  {
    [key in keyof WalletControllerClass]: WalletControllerClass[key] extends (
      ...args: infer ARGS
    ) => infer RET
      ? <T extends IExtractFromPromise<RET> = IExtractFromPromise<RET>>(
          ...args: ARGS
        ) => Promise<IExtractFromPromise<T>>
      : WalletControllerClass[key]
  },
  Record<string, <T = any>(...params: any) => Promise<T>>
>

export type ExtensionWalletController = Record<string, <T = any>(...params: any) => Promise<T>>

export type ExtensionWalletContextReturnType = {
  extensionWallet: ExtensionWalletController | null
}

export const extensionWalletContextDefaults: ExtensionWalletContextReturnType = {
  extensionWallet: null
}
