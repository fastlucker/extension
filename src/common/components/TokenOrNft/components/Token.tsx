import { formatUnits, MaxUint256, ZeroAddress } from 'ethers'
import React, { FC, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable } from 'react-native'

import { getCoinGeckoTokenUrl } from '@ambire-common/consts/coingecko'
import { Network } from '@ambire-common/interfaces/network'
import OpenIcon from '@common/assets/svg/OpenIcon'
import HumanizerAddress from '@common/components/HumanizerAddress'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  amount: bigint
  textSize?: number
  tokenInfo?: {
    decimals: number
    symbol: string
  }
  network?: Network
  address: string
  sizeMultiplierSize?: number
  marginRight: number
}

const InnerToken: FC<Props> = ({
  address,
  amount,
  textSize = 16,
  tokenInfo,
  network,
  sizeMultiplierSize = 1,
  marginRight
}) => {
  const { t } = useTranslation()
  const openExplorer = useCallback(async () => {
    const targetUrl =
      address === ZeroAddress && network?.nativeAssetId
        ? // Exception for native tokens, they don't have a block explorer URLs
          getCoinGeckoTokenUrl(network.nativeAssetId)
        : `${network?.explorerUrl}/address/${address}`

    if (network) await Linking.openURL(targetUrl)
  }, [network, address])

  const shouldDisplayUnlimitedAmount = useMemo(() => {
    const isUnlimitedByPermit2 = amount.toString(16).toLowerCase() === 'f'.repeat(40)
    const isMaxUint256 = amount === MaxUint256
    return isUnlimitedByPermit2 || isMaxUint256
  }, [amount])

  return (
    <>
      {BigInt(amount) > BigInt(0) ? (
        <Text fontSize={textSize} weight="medium" appearance="primaryText">
          {shouldDisplayUnlimitedAmount ? (
            <Text style={spacings.mrTy} appearance="warningText">
              {t('unlimited')}
            </Text>
          ) : (
            <>
              {formatUnits(amount, tokenInfo?.decimals || 0)}{' '}
              {!tokenInfo?.decimals && (
                <Text
                  fontSize={textSize}
                  weight="medium"
                  appearance="primaryText"
                  style={{ maxWidth: '100%', ...spacings.mrTy }}
                >
                  {t('units of')}
                </Text>
              )}
            </>
          )}
        </Text>
      ) : null}
      <Pressable
        style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}
        onPress={openExplorer}
      >
        <TokenIcon
          width={24 * sizeMultiplierSize}
          height={24 * sizeMultiplierSize}
          chainId={network?.chainId}
          address={address}
          withNetworkIcon={false}
        />
        <Text fontSize={textSize} weight="medium" appearance="primaryText" style={spacings.mhMi}>
          {tokenInfo?.symbol || <HumanizerAddress fontSize={textSize} address={address} />}
        </Text>
        {network && <OpenIcon width={14} height={14} />}
      </Pressable>
    </>
  )
}

export default memo(InnerToken)
