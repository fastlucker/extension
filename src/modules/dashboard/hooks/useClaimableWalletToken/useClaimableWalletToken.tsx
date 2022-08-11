import useClaimableWalletTokenCommon from 'ambire-common/src/hooks/useClaimableWalletToken'
import { UseClaimableWalletTokenProps } from 'ambire-common/src/hooks/useClaimableWalletToken/types'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'

const useClaimableWalletToken = (
  params: Omit<UseClaimableWalletTokenProps, 'useAccounts' | 'useNetwork' | 'useRequests'>
) =>
  useClaimableWalletTokenCommon({
    useAccounts,
    useNetwork,
    useRequests,
    ...params
  })

export default useClaimableWalletToken
