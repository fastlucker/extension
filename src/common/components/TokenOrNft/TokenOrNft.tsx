import { ZeroAddress } from 'ethers'
import React, { FC, memo, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { extraNetworks, networks as hardcodedNetwork } from '@ambire-common/consts/networks'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import Address from '@common/components/Address'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import useToast from '@common/hooks/useToast'
import spacings, { SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import getTokenInfo from '@common/utils/tokenInfo'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Nft from './components/Nft'
import Token from './components/Token'

interface Props {
  address: string
  value: bigint
  sizeMultiplierSize?: number
  textSize?: number
  networkId?: NetworkId
  chainId?: bigint
}
const MAX_PORTFOLIO_WAIT_TIME = 2
const MAX_TOTAL_LOADING_TIME = 4

const TokenOrNft: FC<Props> = ({
  value,
  address,
  textSize = 16,
  networkId,
  chainId,
  sizeMultiplierSize = 1
}) => {
  const marginRight = SPACING_TY * sizeMultiplierSize

  const { networks: stateNetworks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()

  const [showLoading, setShowLoading] = useState(true)

  const { addToast } = useToast()
  const [fetchedFromCena, setFetchedFromCena] = useState<
    | {
        decimals: number
        symbol: string
      }
    | undefined
  >()
  const networks: Network[] = useMemo(
    () => [...(stateNetworks || hardcodedNetwork), ...(extraNetworks as Network[])],
    [stateNetworks]
  )
  const network = useMemo(
    () => networks.find((n) => (chainId ? n.chainId === chainId : n.id === networkId)),
    [networks, networkId, chainId]
  )
  const tokenInfo = useMemo(() => {
    if (!network) return
    if (address === ZeroAddress)
      return {
        symbol: network.nativeAssetSymbol,
        decimals: 18
      }

    const infoFromBalance = accountPortfolio?.tokens?.find(
      (token) =>
        token.networkId === networkId && token.address.toLowerCase() === address.toLowerCase()
    )
    return infoFromBalance || fetchedFromCena
  }, [network, accountPortfolio?.tokens, address, fetchedFromCena, networkId])

  const nftInfo = useMemo(() => {
    if (!network) return
    return accountPortfolio?.collections?.find(
      (i) => i.networkId === networkId && address.toLowerCase() === i.address.toLowerCase()
    )
  }, [network, accountPortfolio?.collections, address, networkId])

  useEffect(() => {
    const fetchTriggerTimeout = setTimeout(() => {
      if (!tokenInfo && !nftInfo && network)
        getTokenInfo(address, network.platformId, fetch)
          .then((r) => setFetchedFromCena(r))
          .catch((e) =>
            addToast(e.message, {
              type: 'error'
            })
          )
    }, MAX_PORTFOLIO_WAIT_TIME * 1000)
    const loadingLimitTimeout = setTimeout(() => {
      setShowLoading(false)
    }, MAX_TOTAL_LOADING_TIME * 1000)

    return () => {
      clearTimeout(loadingLimitTimeout)
      clearTimeout(fetchTriggerTimeout)
    }
  }, [tokenInfo, address, network, addToast, networkId])

  return (
    <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}>
      {!network ? (
        <>
          <Address address={address} />
          <Text style={spacings.mlTy}>on {networkId}</Text>
        </>
      ) : nftInfo ? (
        <Nft
          address={address}
          network={network}
          networks={networks}
          tokenId={value}
          nftInfo={nftInfo}
        />
      ) : tokenInfo || !showLoading ? (
        <Token
          textSize={textSize}
          network={network}
          address={address}
          amount={value}
          tokenInfo={tokenInfo}
        />
      ) : (
        <SkeletonLoader width={140} height={24} appearance="tertiaryBackground" />
      )}
    </View>
  )
}

export default memo(TokenOrNft)
