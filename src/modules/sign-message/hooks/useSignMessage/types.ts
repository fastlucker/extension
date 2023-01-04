import { NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { Dispatch, SetStateAction } from 'react'

export type UseSignMessageProps = {
  account: UseAccountsReturnType['account']
  messagesToSign: any[]
  openBottomSheetHardwareWallet: () => any
  resolve: (outcome: any) => void
  onConfirmationCodeRequired: (
    confCodeRequired?: 'email' | 'otp' | null,
    approveQuickAcc?: ({ code }: { code?: string }) => void
  ) => Promise<any>
}

export type UseSignMessageReturnType = {
  approve: (credentials: any, device?: any) => Promise<any>
  approveQuickAcc: ({ code }: { code: string }) => Promise<any>
  setLoading: Dispatch<SetStateAction<boolean>>
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
  dApp: {
    name: string
    description: string
    url: string
    icons: string[]
  }
}
