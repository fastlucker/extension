import { TokenResult as TokenResultInterface } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useRelayerData from '@common/hooks/useRelayerData'
import useMainControllerState from '@web/hooks/useMainControllerState'

export interface IdentityInfoContextDataType {
  isIdentityInfoFetching: boolean
  identityInfo: IdentityInfoResponse
}

export interface IdentityInfoResponse {
  rewards: {
    supplyControllerAddr: string
    claimableRewardsData: any
    multipliers: any[]
    xWalletClaimableBalance?: {} | TokenResultInterface
    walletClaimableBalance?: {} | TokenResultInterface
  }
  gasTank: {
    balance: any[]
    availableGasTankAssets: TokenResultInterface[]
  }
}
const IdentityInfoContext = createContext<IdentityInfoContextDataType>({
  isIdentityInfoFetching: true,
  identityInfo: {
    rewards: {
      supplyControllerAddr: '',
      claimableRewardsData: {},
      multipliers: [],
      xWalletClaimableBalance: {},
      walletClaimableBalance: {}
    },
    gasTank: {
      balance: [],
      availableGasTankAssets: []
    }
  }
})

const IdentityInfoProvider: React.FC = ({ children }: any) => {
  const mainCtrl = useMainControllerState()
  const [isIdentityInfoFetching, setIsIdentityInfoFetching] = useState(true)
  const [identityInfo, setIdentityInfo] = useState({
    rewards: {
      supplyControllerAddr: '',
      claimableRewardsData: {},
      multipliers: [],
      xWalletClaimableBalance: {},
      walletClaimableBalance: {}
    },
    gasTank: {
      balance: [],
      availableGasTankAssets: []
    }
  })

  const fetchIdentityInfo = useCallback(async () => {
    setIsIdentityInfoFetching(true)
    try {
      const res = await useRelayerData(`/v2/identity/${mainCtrl.selectedAccount}/info`)
      if (res.data) {
        setIdentityInfo(res.data)
        setIsIdentityInfoFetching(false)
      }
    } catch (err) {
      setIsIdentityInfoFetching(false)
      //  TODO: handle errors
      console.log(err)
    }
  }, [mainCtrl.selectedAccount])

  useEffect(() => {
    if (!mainCtrl.selectedAccount) return
    // Fetch data on page load
    fetchIdentityInfo()

    // Set up interval to refetch data every minute
    const interval = setInterval(fetchIdentityInfo, 60000)
    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [fetchIdentityInfo, mainCtrl.selectedAccount])

  return (
    <IdentityInfoContext.Provider
      value={useMemo(
        () => ({
          isIdentityInfoFetching,
          identityInfo
        }),
        [isIdentityInfoFetching, identityInfo]
      )}
    >
      {children}
    </IdentityInfoContext.Provider>
  )
}

export { IdentityInfoContext, IdentityInfoProvider }
