import React, { FC, memo, useEffect, useMemo, useState } from 'react'

import { extraNetworks, networks as hardcodedNetwork } from '@ambire-common/consts/networks'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { resolveAssetInfo } from '@ambire-common/services/assetInfo'
import SkeletonLoader from '@common/components/SkeletonLoader'
import { useTranslation } from '@common/config/localization'
import useToast from '@common/hooks/useToast'
import { SPACING_TY } from '@common/styles/spacings'
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

const TokenOrNft: FC<Props> = ({
  value,
  address,
  textSize = 16,
  networkId,
  chainId,
  sizeMultiplierSize = 1
}) => {
  const marginRight = SPACING_TY * sizeMultiplierSize
  const { addToast } = useToast()
  const [assetInfo, setAssetInfo] = useState<any>({})
  const { networks: stateNetworks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { t } = useTranslation()
  const networks: Network[] = useMemo(
    // @TODO: get rid of extraNetworks as they are no longer used in benzin
    () => [...(stateNetworks || hardcodedNetwork), ...(extraNetworks as Network[])],
    [stateNetworks]
  )
  const network = useMemo(
    () => networks.find((n) => (chainId ? n.chainId === chainId : n.id === networkId)),
    [networks, networkId, chainId]
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const tokenFromPortfolio = accountPortfolio?.tokens?.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    )
    const nftFromPortfolio = accountPortfolio?.collections?.find(
      (c) => c.address.toLowerCase() === address.toLowerCase()
    )
    if (tokenFromPortfolio || nftFromPortfolio)
      setAssetInfo({ tokenInfo: tokenFromPortfolio, nftInfo: nftFromPortfolio })
    else if (network)
      resolveAssetInfo(address, network, (_assetInfo: any) => {
        setAssetInfo(_assetInfo)
      }).catch(() => {
        addToast(t('We were unable to fetch token info'), { type: 'error' })
      })
  }, [address, network, addToast, accountPortfolio?.collections, accountPortfolio?.tokens, t])
  return (
    <>
      {!assetInfo.nftInfo && !assetInfo.tokenInfo && isLoading && (
        <SkeletonLoader width={140} height={24} appearance="tertiaryBackground" />
      )}

      {network && assetInfo?.nftInfo && (
        <Nft
          address={address}
          network={network}
          networks={networks}
          tokenId={value}
          nftInfo={assetInfo.nftInfo}
        />
      )}
      {(assetInfo?.tokenInfo || !isLoading) && !assetInfo.nftInfo && (
        <Token
          textSize={textSize}
          network={network}
          address={address}
          amount={value}
          tokenInfo={assetInfo?.tokenInfo}
          marginRight={marginRight}
        />
      )}
    </>
  )
}

export default memo(TokenOrNft)
