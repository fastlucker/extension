import { useEffect, useState } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'

import useClaimableWalletToken from '../useClaimableWalletToken'

export enum RewardIds {
  ADX_REWARDS = 'adx-rewards',
  BALANCE_REWARDS = 'balance-rewards'
}

export default function useRewards() {
  const claimableWalletToken = useClaimableWalletToken()
  const { account, selectedAcc } = useAccounts()

  const [cacheBreak, setCacheBreak] = useState(() => Date.now())
  useEffect(() => {
    if (Date.now() - cacheBreak > 5000) setCacheBreak(Date.now())
    const intvl = setTimeout(() => setCacheBreak(Date.now()), 30000)
    return () => clearTimeout(intvl)
  }, [cacheBreak])
  const rewardsUrl =
    CONFIG.RELAYER_URL && selectedAcc
      ? `${CONFIG.RELAYER_URL}/wallet-token/rewards/${selectedAcc}?cacheBreak=${cacheBreak}`
      : null
  const rewardsData = useRelayerData(rewardsUrl)

  const totalLifetimeRewards = rewardsData.data?.rewards
    ?.map((x) => x.rewards[account.id] || 0)
    .reduce((a, b) => a + b, 0)
  const pendingTokensTotal =
    claimableWalletToken.currentClaimStatus && !claimableWalletToken.currentClaimStatus.loading
      ? (
          (totalLifetimeRewards || 0) -
          (claimableWalletToken.currentClaimStatus.claimed || 0) -
          (claimableWalletToken.currentClaimStatus.claimedInitial || 0) +
          (claimableWalletToken.currentClaimStatus.mintableVesting || 0)
        ).toFixed(3)
      : '...'
  const [rewards, setRewards] = useState({})
  const { isLoading, data, errMsg } = rewardsData

  // const showWalletTokenModal = useDynamicModal(
  //   WalletTokenModal,
  //   { claimableWalletToken, accountId: account.id },
  //   { rewards }
  // )

  useEffect(() => {
    if (errMsg || !data || !data.success) return

    const { rewards, multipliers } = data
    if (!rewards.length) return

    const rewardsDetails = Object.fromEntries(
      rewards.map(({ _id, rewards }) => [_id, rewards[account.id] || 0])
    )
    rewardsDetails.multipliers = multipliers
    rewardsDetails.walletTokenAPY = data.walletTokenAPY
    rewardsDetails.adxTokenAPY = data.adxTokenAPY
    rewardsDetails.walletUsdPrice = data.usdPrice
    rewardsDetails.xWALLETAPY = data.xWALLETAPY
    setRewards(rewardsDetails)
  }, [data, errMsg, account])

  return {
    isLoading,
    errMsg,
    data,
    rewards,
    pendingTokensTotal,
    claimableWalletToken
  }
}
