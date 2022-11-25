import { NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'

export type UseSignMessageProps = {
  account: UseAccountsReturnType['account']
  messagesToSign: any[]
  openBottomSheetHardwareWallet: () => any
  resolve: (outcome: any) => void
  onConfirmationCodeRequired: (
    confCodeRequired?: 'email' | 'otp' | null,
    approveQuickAcc?: (confCode: number) => void
  ) => Promise<any>
}

export type UseSignMessageReturnType = {
  approve: (credentials: any, device?: any) => Promise<any>
  approveQuickAcc: (credentials: any) => Promise<any>
  msgToSign: any
  isLoading: boolean
  hasPrivileges: boolean | null
  typeDataErr: any
  isDeployed: boolean | null
  dataV4: any
  requestedNetwork: NetworkType | undefined
  requestedChainId: NetworkType['chainId']
  isTypedData: boolean
  confirmationType: 'email' | 'otp' | null
  verifySignature: (msgToSign: any, sig: any, networkId: any) => Promise<any>
  dApp: {
    name: string
    description: string
    url: string
    icons: string[]
  }
}
