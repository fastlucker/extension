/* eslint-disable @typescript-eslint/no-floating-promises */
import { formatUnits, ZeroAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'

import gasTankFeeTokens from '@ambire-common/consts/gasTankFeeTokens'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { AccountOpStatus } from '@ambire-common/libs/accountOp/accountOp'
import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'
import { humanizeAccountOp } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { resolveAssetInfo } from '@ambire-common/services/assetInfo'
import { getBenzinUrlParams } from '@ambire-common/utils/benzin'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import OpenIcon from '@common/assets/svg/OpenIcon'
import NetworkBadge from '@common/components/NetworkBadge'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings, { SPACING_SM } from '@common/styles/spacings'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import TransactionSummary, {
  sizeMultiplier
} from '@web/modules/sign-account-op/components/TransactionSummary/TransactionSummary'

import getStyles from './styles'
import SubmittedOn from './SubmittedOn'

interface Props {
  submittedAccountOp: SubmittedAccountOp
  style?: ViewStyle
  showFee?: boolean
  enableExpand?: boolean
  showHeading?: boolean
  showNetworkBadge?: boolean
  blockExplorerAlignedRight?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SubmittedTransactionSummary = ({
  submittedAccountOp,
  showFee = true,
  enableExpand = true,
  showHeading = true,
  showNetworkBadge,
  blockExplorerAlignedRight = false,
  size = 'lg',
  style
}: Props) => {
  const { styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const { networks } = useNetworksControllerState()
  const { t } = useTranslation()
  const textSize = 14 * sizeMultiplier[size]
  const iconSize = 26 * sizeMultiplier[size]
  const footerHorizontalPadding = 28 * sizeMultiplier[size]
  const footerVerticalPadding = SPACING_SM * sizeMultiplier[size]
  const styleFooter = {
    ...styles.footer,
    paddingHorizontal: footerHorizontalPadding,
    paddingVertical: footerVerticalPadding
  }

  const [feeFormattedValue, setFeeFormattedValue] = useState<string>()

  const network = useMemo(
    () => networks.filter((n) => n.id === submittedAccountOp.networkId)[0],
    [networks, submittedAccountOp.networkId]
  )

  const calls = useMemo(
    () => humanizeAccountOp(submittedAccountOp, { network }),
    [submittedAccountOp, network]
  )

  useEffect((): void => {
    const feeTokenAddress = submittedAccountOp.gasFeePayment?.inToken
    const networkId: NetworkId =
      submittedAccountOp.gasFeePayment?.feeTokenNetworkId ||
      // the rest is support for legacy data (no networkId recorded for the fee)
      (feeTokenAddress === ZeroAddress && submittedAccountOp.networkId) ||
      gasTankFeeTokens.find((constFeeToken: any) => constFeeToken.address === feeTokenAddress)
        ?.networkId ||
      submittedAccountOp.networkId

    // did is used to avoid tokenNetwork being Network | undefined
    // the assumption is that we cant pay the fee with token on network that is not present
    const tokenNetwork = networks.filter((n: Network) => n.id === networkId)[0]

    const feeTokenAmount = submittedAccountOp.gasFeePayment?.amount
    if (!feeTokenAddress || !tokenNetwork || !feeTokenAmount) return

    resolveAssetInfo(feeTokenAddress, tokenNetwork, ({ tokenInfo }) => {
      if (!tokenInfo || !submittedAccountOp.gasFeePayment?.amount) return

      const fee = parseFloat(formatUnits(feeTokenAmount, tokenInfo.decimals))

      setFeeFormattedValue(`${formatDecimals(fee)} ${tokenInfo.symbol}`)
    }).catch((e) => {
      console.error(e)
      addToast('We had a problem fetching fee token data', { type: 'error' })
    })
  }, [
    networks,
    submittedAccountOp.networkId,
    submittedAccountOp?.gasFeePayment?.feeTokenNetworkId,
    submittedAccountOp.gasFeePayment?.amount,
    submittedAccountOp.gasFeePayment?.inToken,
    addToast
  ])

  const handleOpenBenzina = useCallback(async () => {
    const chainId = Number(network.chainId)

    if (!chainId || !submittedAccountOp.txnId) throw new Error('Invalid chainId or txnId')

    const link = `https://benzin.ambire.com/${getBenzinUrlParams({
      txnId: submittedAccountOp.txnId,
      chainId,
      identifiedBy: submittedAccountOp.identifiedBy
    })}`

    try {
      await createTab(link)
    } catch (e: any) {
      addToast(e?.message || 'Error opening explorer', { type: 'error' })
    }
  }, [network.chainId, submittedAccountOp.txnId, submittedAccountOp.identifiedBy, addToast])

  const handleOpenBlockExplorer = useCallback(async () => {
    try {
      await createTab(`${network.explorerUrl}/tx/${submittedAccountOp.txnId}`)
    } catch (e: any) {
      addToast(e?.message || 'Error opening block explorer', { type: 'error' })
    }
  }, [network.explorerUrl, submittedAccountOp.txnId, addToast])

  return calls.length ? (
    <View
      style={[
        styles.container,
        style,
        {
          paddingTop: SPACING_SM * sizeMultiplier[size]
        }
      ]}
    >
      {calls.map((call: IrCall, index) => (
        <TransactionSummary
          key={call.fromUserRequestId}
          style={{ ...styles.summaryItem, marginBottom: SPACING_SM * sizeMultiplier[size] }}
          call={call}
          networkId={submittedAccountOp.networkId}
          rightIcon={
            index === 0 &&
            (!submittedAccountOp.status ||
              (submittedAccountOp.status !== AccountOpStatus.Rejected &&
                submittedAccountOp.status !== AccountOpStatus.BroadcastButStuck &&
                submittedAccountOp.status !== AccountOpStatus.UnknownButPastNonce)) ? (
              <OpenIcon />
            ) : null
          }
          onRightIconPress={handleOpenBenzina}
          isHistory
          enableExpand={enableExpand}
          size={size}
        />
      ))}
      {submittedAccountOp.status !== AccountOpStatus.Rejected &&
        submittedAccountOp.status !== AccountOpStatus.BroadcastButStuck &&
        submittedAccountOp.status !== AccountOpStatus.UnknownButPastNonce && (
          <View style={styleFooter}>
            {submittedAccountOp.status === AccountOpStatus.Failure && (
              <View style={styles.footerItem}>
                <Text
                  fontSize={textSize}
                  appearance="errorText"
                  weight="semiBold"
                  style={spacings.mrTy}
                >
                  {t('Failed')}
                </Text>
              </View>
            )}
            {showFee && (
              <View style={styles.footerItem}>
                <Text fontSize={textSize} appearance="secondaryText" weight="semiBold">
                  {t('Fee')}:{' '}
                </Text>

                {submittedAccountOp.gasFeePayment?.isSponsored ? (
                  <Text fontSize={14} appearance="successText" style={spacings.mrTy}>
                    Sponsored
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
              showHeading={showHeading}
              submittedAccountOp={submittedAccountOp}
            />
            {showNetworkBadge && (
              <NetworkBadge
                networkId={network.id}
                withOnPrefix
                fontSize={textSize}
                style={{ ...spacings.pv0, paddingLeft: 0 }}
                iconSize={iconSize}
              />
            )}
            <View
              style={{ ...styles.footerItem, marginLeft: blockExplorerAlignedRight ? 'auto' : 0 }}
            >
              <Text fontSize={textSize} appearance="secondaryText" weight="semiBold">
                {t('Block Explorer')}:{' '}
              </Text>
              <TouchableOpacity onPress={handleOpenBlockExplorer}>
                <Text fontSize={textSize} appearance="secondaryText" selectable underline>
                  {new URL(network.explorerUrl).hostname}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      {submittedAccountOp.status === AccountOpStatus.Rejected && (
        <View style={styleFooter}>
          <View style={styles.footerItem}>
            <Text
              fontSize={textSize}
              appearance="errorText"
              style={spacings.mrTy}
              weight="semiBold"
            >
              Failed to send
            </Text>
          </View>
          <SubmittedOn
            fontSize={textSize}
            showHeading={showHeading}
            submittedAccountOp={submittedAccountOp}
          />
        </View>
      )}
      {submittedAccountOp.status === AccountOpStatus.BroadcastButStuck && (
        <View style={styleFooter}>
          <View style={styles.footerItem}>
            <Text
              fontSize={textSize}
              appearance="errorText"
              style={spacings.mrTy}
              weight="semiBold"
            >
              Dropped or stuck in mempool with fee too low
            </Text>
          </View>
          <SubmittedOn
            fontSize={textSize}
            showHeading={showHeading}
            submittedAccountOp={submittedAccountOp}
          />
        </View>
      )}
      {submittedAccountOp.status === AccountOpStatus.UnknownButPastNonce && (
        <View style={styleFooter}>
          <View style={styles.footerItem}>
            <Text
              fontSize={textSize}
              appearance="errorText"
              style={spacings.mrTy}
              weight="semiBold"
            >
              Replaced by fee (RBF)
            </Text>
          </View>
          <SubmittedOn
            fontSize={textSize}
            showHeading={showHeading}
            submittedAccountOp={submittedAccountOp}
          />
        </View>
      )}
    </View>
  ) : (
    <View style={style}>
      <SkeletonLoader width="100%" height={112} />
    </View>
  )
}

export default React.memo(SubmittedTransactionSummary)
