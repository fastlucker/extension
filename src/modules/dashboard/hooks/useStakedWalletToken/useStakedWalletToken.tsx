import useStakedWalletTokenCommon from 'ambire-common/src/hooks/useStakedWalletToken'

import useAccounts from '@modules/common/hooks/useAccounts'

const useStakedWalletToken = () =>
  useStakedWalletTokenCommon({
    useAccounts
  })

export default useStakedWalletToken
