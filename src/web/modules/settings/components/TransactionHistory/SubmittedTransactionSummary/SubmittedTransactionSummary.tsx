/* eslint-disable @typescript-eslint/no-floating-promises */
import { formatUnits, ZeroAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'

import gasTankFeeTokens from '@ambire-common/consts/gasTankFeeTokens'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { AccountOpStatus } from '@ambire-common/libs/accountOp/accountOp'
import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'
import { humanizeAccountOp } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { resolveAssetInfo } from '@ambire-common/services/assetInfo'
import { getBenzinUrlParams } from '@ambire-common/utils/benzin'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import LinkIcon from '@common/assets/svg/LinkIcon'
import RepeatIcon from '@common/assets/svg/RepeatIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Badge from '@common/components/Badge'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_SM } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import TransactionSummary, {
  sizeMultiplier
} from '@web/modules/sign-account-op/components/TransactionSummary'

import getStyles from './styles'
import SubmittedOn from './SubmittedOn'

interface Props {
  submittedAccountOp: SubmittedAccountOp
  style?: ViewStyle
  size?: 'sm' | 'md' | 'lg'
  defaultType: 'summary' | 'full-info'
}

const SubmittedTransactionSummary = ({
  submittedAccountOp,
  size = 'lg',
  style,
  defaultType
}: Props) => {
  const { dispatch } = useBackgroundService()
  const { styles, theme } = useTheme(getStyles)
  const { addToast } = useToast()
  const { networks } = useNetworksControllerState()
  const { maxWidthSize } = useWindowSize()
  const { t } = useTranslation()
  const textSize = 14 * sizeMultiplier[size]
  const iconSize = 26 * sizeMultiplier[size]
  const [isFooterExpanded, setIsFooterExpanded] = useState(defaultType === 'full-info')

  const [feeFormattedValue, setFeeFormattedValue] = useState<string>()

  const network: Network | undefined = useMemo(
    () => networks.find((n) => n.id === submittedAccountOp.networkId),
    [networks, submittedAccountOp.networkId]
  )

  const calls = useMemo(
    () =>
      humanizeAccountOp(submittedAccountOp, { network }).map((call, index) => ({
        ...call,
        // It's okay to use index as:
        // 1. The calls aren't reordered
        // 2. We are building the calls only once
        id: call.id || String(index)
      })),
    // Humanize the calls only once. Because submittedAccountOp is an object
    // it causes rerenders on every activity update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submittedAccountOp.txnId, submittedAccountOp.calls.length, network]
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
    const chainId = Number(network?.chainId)

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
  }, [network?.chainId, submittedAccountOp.txnId, submittedAccountOp.identifiedBy, addToast])

  const handleRepeatTransaction = useCallback(() => {
    const { calls: rawCalls } = submittedAccountOp

    const userTx = {
      kind: 'calls' as const,
      calls: rawCalls
    }

    const userRequest: UserRequest = {
      id: new Date().getTime(),
      action: userTx,
      meta: {
        isSignAction: true,
        networkId: submittedAccountOp.networkId,
        accountAddr: submittedAccountOp.accountAddr
      }
    }

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
      params: userRequest
    })
  }, [dispatch, submittedAccountOp])

  const handleOpenBlockExplorer = useCallback(async () => {
    try {
      await createTab(`${network?.explorerUrl}/tx/${submittedAccountOp.txnId}`)
    } catch (e: any) {
      addToast(e?.message || 'Error opening block explorer', { type: 'error' })
    }
  }, [network?.explorerUrl, submittedAccountOp.txnId, addToast])

  if (!network) return null

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
      {calls.map((call: IrCall) => (
        <TransactionSummary
          key={call.id}
          style={{ ...styles.summaryItem, marginBottom: SPACING_SM * sizeMultiplier[size] }}
          call={call}
          networkId={submittedAccountOp.networkId}
          isHistory
          enableExpand={defaultType === 'full-info'}
          size={size}
        />
      ))}
      {submittedAccountOp.status !== AccountOpStatus.Rejected &&
        submittedAccountOp.status !== AccountOpStatus.BroadcastButStuck &&
        submittedAccountOp.status !== AccountOpStatus.UnknownButPastNonce && (
          <View style={spacings.phMd}>
            <View style={styles.footer}>
              {submittedAccountOp.status === AccountOpStatus.Failure && (
                <Badge type="error" weight="medium" text={t('Failed')} withRightSpacing />
              )}
              {submittedAccountOp.status === AccountOpStatus.Success && (
                <Badge type="success" weight="medium" text={t('Confirmed')} withRightSpacing />
              )}
              {!!isFooterExpanded && (
                <View style={spacings.mrTy}>
                  <Text fontSize={textSize} appearance="secondaryText" weight="semiBold">
                    {t('Fee')}:
                  </Text>

                  {submittedAccountOp.gasFeePayment?.isSponsored ? (
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
                submittedAccountOp={submittedAccountOp}
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
                <TouchableOpacity
                  style={[flexbox.directionRow, flexbox.alignCenter]}
                  onPress={handleRepeatTransaction}
                >
                  <Text
                    fontSize={textSize}
                    appearance="secondaryText"
                    weight="medium"
                    style={spacings.mrMi}
                  >
                    {t('Repeat Transaction')}
                  </Text>
                  <RepeatIcon
                    width={textSize}
                    height={textSize}
                    color={theme.secondaryText}
                    style={spacings.mrMi}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
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
      {submittedAccountOp.status === AccountOpStatus.Rejected && (
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
              submittedAccountOp={submittedAccountOp}
              numberOfLines={1}
            />
          </View>
        </View>
      )}
      {submittedAccountOp.status === AccountOpStatus.BroadcastButStuck && (
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
              submittedAccountOp={submittedAccountOp}
              numberOfLines={maxWidthSize(1150) ? 1 : 2}
            />
          </View>
        </View>
      )}
      {submittedAccountOp.status === AccountOpStatus.UnknownButPastNonce && (
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
              submittedAccountOp={submittedAccountOp}
              numberOfLines={1}
            />
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
