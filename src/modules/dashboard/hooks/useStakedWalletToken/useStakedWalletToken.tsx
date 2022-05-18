import WalletStakingPoolABI from 'ambire-common/src/constants/abis/WalletStakingPoolABI.json'
import { Contract } from 'ethers'
import { formatUnits, Interface } from 'ethers/lib/utils'
import React, { useCallback, useEffect, useState } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import { getProvider } from '@modules/common/services/provider'

const WALLET_STAKING_ADDRESS = '0x47cd7e91c3cbaaf266369fe8518345fc4fc12935'
const WALLET_STAKING_POOL_INTERFACE = new Interface(WalletStakingPoolABI)

const provider = getProvider('ethereum')
const stakingWalletContract = new Contract(
  WALLET_STAKING_ADDRESS,
  WALLET_STAKING_POOL_INTERFACE,
  provider
)

export default function useStakedWalletToken() {
  const { account } = useAccounts()
  const [stakedAmount, setStakedAmount] = useState(0)

  const fetchStakedWalletData = useCallback(async () => {
    try {
      const [balanceOf, shareValue] = await Promise.all([
        stakingWalletContract.balanceOf(account.id),
        stakingWalletContract.shareValue()
      ])

      const stakedAmount =
        formatUnits(balanceOf.toString(), 18).toString() * formatUnits(shareValue, 18).toString()
      setStakedAmount(stakedAmount)
    } catch (e) {
      // Fail silently
    }
  }, [account.id])

  useEffect(() => fetchStakedWalletData(), [fetchStakedWalletData])

  return { stakedAmount }
}
