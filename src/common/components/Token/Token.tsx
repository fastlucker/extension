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

interface Props {
  address: string
  amount: bigint
  sizeMultiplierSize: number
  textSize: number
  network: Network
}

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

  const [tokenInfo, setTokenInfo] = useState<
    null | undefined | { decimals: number; symbol: string }
  >(null)

  useEffect(() => {
    const infoFromBalance = accountPortfolio?.tokens?.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    )
    const infoNative = address === ZeroAddress && {
      symbol: network.nativeAssetSymbol,
      decimals: 18
    }
    if (infoNative) setTokenInfo(infoNative)
    else if (infoFromBalance) setTokenInfo(infoFromBalance)
    else
      getTokenInfo(address, network.id, fetch)
        .then((r) => setTokenInfo(r))
        .catch(console.error)
  }, [network, accountPortfolio?.tokens, address])

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
      (nftInfo ?
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
      :
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
          <Text fontSize={textSize} weight="medium" appearance="primaryText" style={spacings.mrMi}>
            {tokenInfo?.symbol || t('unknown token')}
          </Text>
          <OpenIcon width={14} height={14} />
        </Pressable>
      </>
      )
    </View>
  )
}

export default memo(Token)
