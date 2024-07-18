import { formatUnits, MaxUint256, ZeroAddress } from 'ethers'
import React, { FC, memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import spacings, { SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import getTokenInfo from '@common/utils/tokenInfo'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Address from '../Address'
import Collectible from '../Collectible'
import SkeletonLoader from '../SkeletonLoader'

interface Props {
  address: string
  amount: bigint
  sizeMultiplierSize: number
  textSize: number
  network: Network
}
const SECONDS_BEFORE_FETCH = 2
const SECONDS_FOR_LOADING = 4

const Token: FC<Props> = ({ amount, address, sizeMultiplierSize, textSize, network }) => {
  const marginRight = SPACING_TY * sizeMultiplierSize
  const shouldDisplayUnlimitedAmount = useMemo(() => {
    const isUnlimitedByPermit2 = amount.toString(16).toLowerCase() === 'f'.repeat(40)
    const isMaxUint256 = amount === MaxUint256
    return isUnlimitedByPermit2 || isMaxUint256
  }, [amount])
  const { networks } = useNetworksControllerState()
  const { t } = useTranslation()
  const { accountPortfolio } = usePortfolioControllerState()

  const [showLoading, setShowLoading] = useState(true)
  const [tokenInfo, setTokenInfo] = useState<
    null | undefined | { decimals: number; symbol: string }
  >(null)
  const [fetchedFromCena, setFetchedFromCena] = useState<{
    decimals: number
    symbol: string
  } | null>()

  useEffect(() => {
    const fetchTriggerTimeout = setTimeout(() => {
      if (!tokenInfo)
        getTokenInfo(address, network.platformId, fetch)
          .then((r) => setFetchedFromCena(r))
          .catch(console.error)
    }, SECONDS_BEFORE_FETCH * 1000)
    const loadingLimitTimeout = setTimeout(() => {
      setShowLoading(false)
    }, SECONDS_FOR_LOADING * 5000)

    return () => {
      clearTimeout(loadingLimitTimeout)
      clearTimeout(fetchTriggerTimeout)
    }
  }, [tokenInfo, address, network.id])

  useEffect(() => {
    const infoFromBalance = accountPortfolio?.tokens?.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    )
    const infoNative = address === ZeroAddress && {
      symbol: network.nativeAssetSymbol,
      decimals: 18
    }
    setTokenInfo(infoNative || infoFromBalance || fetchedFromCena)
  }, [network, accountPortfolio?.tokens, address, fetchedFromCena])

  const nftInfo = useMemo(() => {
    return accountPortfolio?.collections?.find(
      (i) => address.toLowerCase() === i.address.toLowerCase()
    )
  }, [accountPortfolio?.collections, address])

  const openExplorer = useMemo(
    () => () => Linking.openURL(`${network.explorerUrl}/address/${address}`),
    [address, network.explorerUrl]
  )

  return (
    <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}>
      {nftInfo ? (
        <>
          <Address
            fontSize={textSize}
            address={address}
            highestPriorityAlias={nftInfo?.name || `NFT #${amount}`}
            explorerNetworkId={network.id}
          />
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
        </>
      ) : // ) : true ? (
      showLoading && !tokenInfo ? (
        <SkeletonLoader width={100} height={24} appearance="primaryBackground" />
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
