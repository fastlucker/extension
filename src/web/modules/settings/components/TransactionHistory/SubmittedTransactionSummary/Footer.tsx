/* eslint-disable @typescript-eslint/no-floating-promises */
import { formatUnits, ZeroAddress } from 'ethers'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import gasTankFeeTokens from '@ambire-common/consts/gasTankFeeTokens'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'
import { AccountOpStatus } from '@ambire-common/libs/accountOp/types'
import { resolveAssetInfo } from '@ambire-common/services/assetInfo'
import { getBenzinUrlParams } from '@ambire-common/utils/benzin'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import LinkIcon from '@common/assets/svg/LinkIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Badge from '@common/components/Badge'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import { sizeMultiplier } from '@web/modules/sign-account-op/components/TransactionSummary'

import RepeatTransaction from './RepeatTransaction'
import getStyles from './styles'
import SubmittedOn from './SubmittedOn'

type Props = {
  network: Network
  size: 'sm' | 'md' | 'lg'
  defaultType: 'summary' | 'full-info'
  rawCalls?: SubmittedAccountOp['calls']
} & Pick<
  SubmittedAccountOp,
  'txnId' | 'identifiedBy' | 'accountAddr' | 'gasFeePayment' | 'status' | 'timestamp'
>

const Footer: FC<Props> = ({
  network,
  txnId,
  rawCalls,
  identifiedBy,
  accountAddr,
  gasFeePayment,
  status,
  size,
  defaultType,
  timestamp
}) => {
  const { styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const { networks } = useNetworksControllerState()
  const { maxWidthSize } = useWindowSize()
  const { t } = useTranslation()
  const textSize = 14 * sizeMultiplier[size]
  const iconSize = 26 * sizeMultiplier[size]
  const [isFooterExpanded, setIsFooterExpanded] = useState(defaultType === 'full-info')
  const networkId = network.id

  const [feeFormattedValue, setFeeFormattedValue] = useState<string>()

  const handleOpenBenzina = useCallback(async () => {
    const chainId = Number(network?.chainId)

    if (!chainId || !txnId) throw new Error('Invalid chainId or txnId')

    const link = `https://benzin.ambire.com/${getBenzinUrlParams({
      txnId,
      chainId,
      identifiedBy
    })}`

    try {
      await createTab(link)
    } catch (e: any) {
      addToast(e?.message || 'Error opening explorer', { type: 'error' })
    }
  }, [network?.chainId, txnId, identifiedBy, addToast])

  const handleOpenBlockExplorer = useCallback(async () => {
    try {
      await createTab(`${network?.explorerUrl}/tx/${txnId}`)
    } catch (e: any) {
      addToast(e?.message || 'Error opening block explorer', { type: 'error' })
    }
  }, [network?.explorerUrl, txnId, addToast])

  useEffect((): void => {
    const feeTokenAddress = gasFeePayment?.inToken
    const nId: NetworkId =
      gasFeePayment?.feeTokenNetworkId ||
      // the rest is support for legacy data (no networkId recorded for the fee)
      (feeTokenAddress === ZeroAddress && networkId) ||
      gasTankFeeTokens.find((constFeeToken: any) => constFeeToken.address === feeTokenAddress)
        ?.networkId ||
      networkId

    // did is used to avoid tokenNetwork being Network | undefined
    // the assumption is that we cant pay the fee with token on network that is not present
    const tokenNetwork = networks.filter((n: Network) => n.id === nId)[0]

    const feeTokenAmount = gasFeePayment?.amount
    if (!feeTokenAddress || !tokenNetwork || !feeTokenAmount) return

    resolveAssetInfo(feeTokenAddress, tokenNetwork, ({ tokenInfo }) => {
      if (!tokenInfo || !gasFeePayment?.amount) return

      const fee = parseFloat(formatUnits(feeTokenAmount, tokenInfo.decimals))

      setFeeFormattedValue(`${formatDecimals(fee)} ${tokenInfo.symbol}`)
    }).catch((e) => {
      console.error(e)
      addToast('We had a problem fetching fee token data', { type: 'error' })
    })
  }, [
    networks,
    networkId,
    gasFeePayment?.feeTokenNetworkId,
    gasFeePayment?.amount,
    gasFeePayment?.inToken,
    addToast
  ])

  return (
    <>
      {status !== AccountOpStatus.Rejected &&
        status !== AccountOpStatus.BroadcastButStuck &&
        status !== AccountOpStatus.UnknownButPastNonce && (
          <View style={spacings.phMd}>
            <View style={styles.footer}>
              {status === AccountOpStatus.Failure && (
                <Badge type="error" weight="medium" text={t('Failed')} withRightSpacing />
              )}
              {status === AccountOpStatus.Success && (
                <Badge type="success" weight="medium" text={t('Confirmed')} withRightSpacing />
              )}
              {!!isFooterExpanded && (
                <View style={spacings.mrTy}>
                  <Text fontSize={textSize} appearance="secondaryText" weight="semiBold">
                    {t('Fee')}:
                  </Text>

                  {gasFeePayment?.isSponsored ? (
                    <Text fontSize={14} appearance="successText" style={spacings.mrTy}>
                      {t('Sponsored')}
                    </Text>
                  ) : (
                    <Text fontSize={textSize} appearance="secondaryText" style={spacings.mrTy}>
                      {feeFormattedValue || <SkeletonLoader width={80} height={21} />}
                    </Text>
                  )}
                </View>
              )}
              <SubmittedOn
                fontSize={textSize}
                iconSize={iconSize}
                networkId={network.id}
                timestamp={timestamp}
                numberOfLines={isFooterExpanded ? 2 : 1}
              />
              {isFooterExpanded ? (
                <View style={flexbox.alignEnd}>
                  <TouchableOpacity
                    style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbMi]}
                    onPress={handleOpenBenzina}
                  >
                    <Text
                      fontSize={textSize}
                      appearance="secondaryText"
                      weight="medium"
                      style={spacings.mrMi}
                      underline
                    >
                      {t('View transaction')}
                    </Text>
                    <LinkIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[flexbox.directionRow, flexbox.alignCenter]}
                    onPress={handleOpenBlockExplorer}
                  >
                    <Text
                      fontSize={textSize}
                      appearance="secondaryText"
                      weight="medium"
                      style={spacings.mrMi}
                      underline
                    >
                      {t('View in block explorer')}
                    </Text>
                    <LinkIcon />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[flexbox.directionRow, flexbox.alignCenter]}
                  onPress={() => setIsFooterExpanded(true)}
                >
                  <Text
                    fontSize={textSize}
                    appearance="secondaryText"
                    weight="medium"
                    style={spacings.mrMi}
                  >
                    {t('Show more')}
                  </Text>
                  <DownArrowIcon />
                </TouchableOpacity>
              )}
            </View>

            {defaultType === 'summary' && isFooterExpanded && (
              <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, spacings.mbSm]}>
                {rawCalls?.length ? (
                  <RepeatTransaction
                    accountAddr={accountAddr}
                    networkId={network.id}
                    rawCalls={rawCalls}
                    textSize={textSize}
                  />
                ) : (
                  <View />
                )}
                <TouchableOpacity
                  style={[flexbox.directionRow, flexbox.alignCenter]}
                  onPress={() => setIsFooterExpanded(false)}
                >
                  <Text
                    fontSize={textSize}
                    appearance="secondaryText"
                    weight="medium"
                    style={spacings.mrMi}
                  >
                    {t('Show less')}
                  </Text>
                  <UpArrowIcon />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      {status === AccountOpStatus.Rejected && (
        <View style={spacings.phMd}>
          <View style={[styles.footer, flexbox.justifyStart]}>
            <View style={spacings.mrTy}>
              <Text
                fontSize={textSize}
                appearance="errorText"
                style={spacings.mrTy}
                weight="semiBold"
              >
                {t('Failed to send')}
              </Text>
            </View>
            <SubmittedOn
              fontSize={textSize}
              iconSize={iconSize}
              networkId={network.id}
              timestamp={timestamp}
              numberOfLines={1}
            />
          </View>
        </View>
      )}
      {status === AccountOpStatus.BroadcastButStuck && (
        <View style={spacings.phMd}>
          <View style={[styles.footer, flexbox.justifyStart]}>
            <View style={spacings.mrTy}>
              <Text
                fontSize={textSize}
                appearance="errorText"
                style={spacings.mrTy}
                weight="semiBold"
              >
                {maxWidthSize(1000)
                  ? t('Dropped or stuck in mempool with fee too low')
                  : t('Dropped or stuck in\nmempool with fee too low')}
              </Text>
            </View>
            <SubmittedOn
              fontSize={textSize}
              iconSize={iconSize}
              networkId={network.id}
              timestamp={timestamp}
              numberOfLines={maxWidthSize(1150) ? 1 : 2}
            />
          </View>
        </View>
      )}
      {status === AccountOpStatus.UnknownButPastNonce && (
        <View style={spacings.phMd}>
          <View style={[styles.footer, flexbox.justifyStart]}>
            <View style={spacings.mrTy}>
              <Text
                fontSize={textSize}
                appearance="errorText"
                style={spacings.mrTy}
                weight="semiBold"
              >
                {t('Replaced by fee (RBF)')}
              </Text>
            </View>
            <SubmittedOn
              fontSize={textSize}
              iconSize={iconSize}
              networkId={network.id}
              timestamp={timestamp}
              numberOfLines={1}
            />
          </View>
        </View>
      )}
    </>
  )
}

export default Footer
