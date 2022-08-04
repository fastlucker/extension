import useRewardsCommon from 'ambire-common/src/hooks/useRewards'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import useClaimableWalletToken from '@modules/dashboard/hooks/useClaimableWalletToken'

export default function useRewards() {
  const { isLoading, errMsg, data, rewards, pendingTokensTotal, claimableWalletToken } =
    useRewardsCommon({
      relayerURL: CONFIG.RELAYER_URL,
      useAccounts,
      useClaimableWalletToken,
      useRelayerData
    })

  return {
    isLoading,
    errMsg,
    data,
    rewards,
    pendingTokensTotal,
    claimableWalletToken
  }
}
