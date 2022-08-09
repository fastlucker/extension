import useRewardsCommon from 'ambire-common/src/hooks/useRewards'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'

const useRewards = () =>
  useRewardsCommon({
    relayerURL: CONFIG.RELAYER_URL,
    useAccounts,
    useRelayerData
  })

export default useRewards
