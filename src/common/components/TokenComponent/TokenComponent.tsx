import { formatUnits, MaxUint256, ZeroAddress } from 'ethers'
import React, { FC, memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { getTokenInfo } from '@ambire-common/libs/humanizer/utils'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { SPACING_TY } from '@common/styles/spacings'
import formatDecimals from '@common/utils/formatDecimals'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

interface Props {
  key: number
  style: ViewStyle
  address: string
  amount: bigint
  sizeMultiplierSize: number
  textSize: number
  network: Network
}

const TokenComponent: FC<Props> = ({
  key,
  style,
  amount,
  address,
  sizeMultiplierSize,
  textSize,
  network
}) => {
  const marginRight = SPACING_TY * sizeMultiplierSize
  const { accountPortfolio } = usePortfolioControllerState()
  const { t } = useTranslation()
  const isUnlimitedByPermit2 = amount!.toString(16).toLowerCase() === 'f'.repeat(40)
  const isMaxUint256 = amount === MaxUint256
  const infoFromCurrentBalances = accountPortfolio?.tokens?.find(
    (token) => token.address.toLowerCase() === address
  )

  const nativeTokenInfo = useMemo(
    () =>
      address === ZeroAddress && {
        symbol: network.nativeAssetSymbol,
        decimals: 18
      },
    [address, network]
  )
  const [fetchedFromCena, setFetchedFromCena] = useState(null)

  useEffect(() => {
    if (!infoFromCurrentBalances && !nativeTokenInfo)
      getTokenInfo({ networkId: network.id, accountAddr: ZeroAddress }, address, {
        fetch,
        network
      })
        .then((r) => setFetchedFromCena(r?.value))
        .catch((e) => console.error(e))
  }, [nativeTokenInfo, infoFromCurrentBalances, address, network])

  const tokenInfo: { decimals?: number; symbol?: string } =
    infoFromCurrentBalances || nativeTokenInfo || fetchedFromCena || {}

  return (
    <View key={key} style={style}>
      {BigInt(amount) > BigInt(0) ? (
        <Text
          fontSize={textSize}
          weight="medium"
          appearance="primaryText"
          style={{ maxWidth: '100%' }}
        >
          {isUnlimitedByPermit2 || isMaxUint256 ? (
            <Text appearance="warningText">{t('unlimited')}</Text>
          ) : (
            <>
              {formatDecimals(
                Number(
                  // @TODO should fix the decimals
                  formatUnits(amount, tokenInfo?.decimals || 1)
                )
              )}{' '}
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
      <TokenIcon
        width={24 * sizeMultiplierSize}
        height={24 * sizeMultiplierSize}
        networkId={network.id}
        address={address}
        withNetworkIcon={false}
        containerStyle={{ marginRight: marginRight / 2 }}
      />
      <Text fontSize={textSize} weight="medium" appearance="primaryText">
        {tokenInfo?.symbol || t('unknown token')}
      </Text>
    </View>
  )
}

export default memo(TokenComponent)
