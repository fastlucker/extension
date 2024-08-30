/* eslint-disable @typescript-eslint/no-floating-promises */
import { formatUnits, ZeroAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, ViewStyle } from 'react-native'

import gasTankFeeTokens from '@ambire-common/consts/gasTankFeeTokens'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { AccountOpStatus } from '@ambire-common/libs/accountOp/accountOp'
import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'
import { humanizeAccountOp } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { resolveAssetInfo } from '@ambire-common/services/assetInfo'
import { getBenzinUrlParams } from '@benzin/screens/BenzinScreen/utils/url'
import OpenIcon from '@common/assets/svg/OpenIcon'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import formatDecimals from '@common/utils/formatDecimals'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import getStyles from './styles'

interface Props {
  submittedAccountOp: SubmittedAccountOp
  style?: ViewStyle
}

const SubmittedTransactionSummary = ({ submittedAccountOp, style }: Props) => {
  const { styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const { networks } = useNetworksControllerState()
  const { t } = useTranslation()

  const [feeFormattedValue, setFeeFormattedValue] = useState<string>()

  const network = useMemo(
    () => networks.filter((n) => n.id === submittedAccountOp.networkId)[0],
    [networks, submittedAccountOp.networkId]
  )

  const calls = useMemo(() => {
    return humanizeAccountOp(submittedAccountOp, { network })
  }, [submittedAccountOp, network])

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
      console.log(`${formatDecimals(fee)} ${tokenInfo.symbol}`, feeTokenAddress)

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

  const handleOpenExplorer = useCallback(async () => {
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

  return calls.length ? (
    <View style={[styles.container, style]}>
      {calls.map((call: IrCall, index) => (
        <TransactionSummary
          key={call.fromUserRequestId}
          style={styles.summaryItem}
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
          onRightIconPress={handleOpenExplorer}
          isHistory
        />
      ))}
      {submittedAccountOp.status !== AccountOpStatus.Rejected &&
        submittedAccountOp.status !== AccountOpStatus.BroadcastButStuck &&
        submittedAccountOp.status !== AccountOpStatus.UnknownButPastNonce && (
          <View style={styles.footer}>
            {submittedAccountOp.status === AccountOpStatus.Failure && (
              <View style={styles.footerItem}>
                <Text fontSize={14} appearance="errorText" weight="semiBold">
                  {t('Failed')}
                </Text>
              </View>
            )}
            <View style={styles.footerItem}>
              <Text fontSize={14} appearance="secondaryText" weight="semiBold">
                {t('Fee')}:{' '}
              </Text>
              <Text fontSize={14} appearance="secondaryText" style={spacings.mrTy}>
                {feeFormattedValue || <SkeletonLoader width={80} height={21} />}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Text fontSize={14} appearance="secondaryText" weight="semiBold">
                {t('Submitted on')}:{' '}
              </Text>
              {new Date(submittedAccountOp.timestamp).toString() !== 'Invalid Date' && (
                <Text fontSize={14} appearance="secondaryText" style={spacings.mrTy}>
                  {`${new Date(submittedAccountOp.timestamp).toLocaleDateString()} (${new Date(
                    submittedAccountOp.timestamp
                  ).toLocaleTimeString()})`}
                </Text>
              )}
            </View>
            <View style={styles.footerItem}>
              <Text fontSize={14} appearance="secondaryText" weight="semiBold">
                {t('Block Explorer')}:{' '}
              </Text>
              <Text fontSize={14} appearance="secondaryText" style={spacings.mrTy} selectable>
                {new URL(network.explorerUrl).hostname}
              </Text>
            </View>
          </View>
        )}
      {submittedAccountOp.status === AccountOpStatus.Rejected && (
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text fontSize={14} appearance="errorText" style={spacings.mrTy} weight="semiBold">
              Failed to send
            </Text>
          </View>
        </View>
      )}
      {submittedAccountOp.status === AccountOpStatus.BroadcastButStuck && (
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text fontSize={14} appearance="errorText" style={spacings.mrTy} weight="semiBold">
              Dropped or stuck in mempool with fee too low
            </Text>
          </View>
        </View>
      )}
      {submittedAccountOp.status === AccountOpStatus.UnknownButPastNonce && (
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text fontSize={14} appearance="errorText" style={spacings.mrTy} weight="semiBold">
              Replaced by fee (RBF)
            </Text>
          </View>
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
