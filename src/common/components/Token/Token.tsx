import { formatUnits, MaxUint256, ZeroAddress } from 'ethers'
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, View } from 'react-native'

import { extraNetworks, networks as hardcodedNetwork } from '@ambire-common/consts/networks'
import { NetworkId } from '@ambire-common/interfaces/network'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Address from '@common/components/Address'
import Collectible from '@common/components/Collectible'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useToast from '@common/hooks/useToast'
import spacings, { SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import getTokenInfo from '@common/utils/tokenInfo'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

interface Props {
  address: string
  amount: bigint
  sizeMultiplierSize: number
  textSize: number
  networkId?: NetworkId
}
const MAX_PORTFOLIO_WAIT_TIME = 2
const MAX_TOTAL_LOADING_TIME = 4

const Token: FC<Props> = ({ amount, address, sizeMultiplierSize, textSize, networkId }) => {
  const marginRight = SPACING_TY * sizeMultiplierSize
  const shouldDisplayUnlimitedAmount = useMemo(() => {
    const isUnlimitedByPermit2 = amount.toString(16).toLowerCase() === 'f'.repeat(40)
    const isMaxUint256 = amount === MaxUint256
    return isUnlimitedByPermit2 || isMaxUint256
  }, [amount])
  const { networks: stateNetworks } = useNetworksControllerState()
  const { t } = useTranslation()
  const { accountPortfolio } = usePortfolioControllerState()

  const [showLoading, setShowLoading] = useState(true)
  // const [tokenInfo, setTokenInfo] = useState<
  // null | undefined | { decimals: number; symbol: string }
  // >(null)
  const { addToast } = useToast()
  const [fetchedFromCena, setFetchedFromCena] = useState<{
    decimals: number
    symbol: string
  } | null>()
  const networks = useMemo(
    () => stateNetworks || [...hardcodedNetwork, ...extraNetworks],
    [stateNetworks]
  )
  const network = useMemo(
    // TODO: this compromise should be discussed and fix in future PR
    // are we gonna show warning/to what website/explorer are we going to redirect on click
    // how are going to get the decimals and symbol
    () => networks.find((n) => n.id === networkId) || networks[0],
    [networks, networkId]
  )

  const tokenInfo = useMemo(() => {
    if (address === ZeroAddress)
      return {
        symbol: network.nativeAssetSymbol,
        decimals: 18
      }

    const infoFromBalance = accountPortfolio?.tokens?.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    )

    return infoFromBalance || fetchedFromCena
  }, [network, accountPortfolio?.tokens, address, fetchedFromCena])

  useEffect(() => {
    const fetchTriggerTimeout = setTimeout(() => {
      if (!tokenInfo)
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
  }, [tokenInfo, address, network.platformId, addToast, networkId])

  const nftInfo = useMemo(() => {
    return accountPortfolio?.collections?.find(
      (i) => address.toLowerCase() === i.address.toLowerCase()
    )
  }, [accountPortfolio?.collections, address])

  const openExplorer = useCallback(
    () => Linking.openURL(`${network.explorerUrl}/address/${address}`),
    [address, network.explorerUrl]
  )

  return (
    <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}>
      {nftInfo ? (
        <>
          <Collectible
            style={spacings.mhTy}
            size={36}
            id={amount}
            collectionData={{
              address,
              networkId: network.id
            }}
            networks={networks}
          />
          <Address
            fontSize={textSize}
            address={address}
            highestPriorityAlias={nftInfo?.name || `NFT #${amount}`}
            explorerNetworkId={network.id}
          />
        </>
      ) : // ) : true ? (
      showLoading && !tokenInfo ? (
        <SkeletonLoader width={100} height={24} appearance="tertiaryBackground" />
      ) : (
        <>
          {BigInt(amount) > BigInt(0) ? (
            <Text
              fontSize={textSize}
              weight="medium"
              appearance="primaryText"
              style={{ maxWidth: '100%' }}
            >
              {shouldDisplayUnlimitedAmount ? (
                <Text appearance="warningText">{t('unlimited')}</Text>
              ) : (
                <>
                  {formatDecimals(Number(formatUnits(amount, tokenInfo?.decimals || 1)))}{' '}
                  {!tokenInfo?.decimals && (
                    <Text
                      fontSize={textSize}
                      weight="medium"
                      appearance="primaryText"
                      style={{ maxWidth: '100%' }}
                    >
                      {t('units of')}
                    </Text>
                  )}
                </>
              )}
            </Text>
          ) : null}
          <Pressable
            style={{ ...spacings.mlMi, ...flexbox.directionRow, ...flexbox.alignCenter }}
            onPress={openExplorer}
          >
            <TokenIcon
              width={24 * sizeMultiplierSize}
              height={24 * sizeMultiplierSize}
              networkId={network.id}
              address={address}
              withNetworkIcon={false}
              containerStyle={{ marginRight: marginRight / 2 }}
            />
            <Text
              fontSize={textSize}
              weight="medium"
              appearance="primaryText"
              style={spacings.mrMi}
            >
              {tokenInfo?.symbol || t('unknown token')}
            </Text>
            <OpenIcon width={14} height={14} />
          </Pressable>
        </>
      )}
    </View>
  )
}

export default memo(Token)
