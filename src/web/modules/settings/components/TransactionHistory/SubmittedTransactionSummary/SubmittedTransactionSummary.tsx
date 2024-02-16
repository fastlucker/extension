import { formatUnits } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, View, ViewStyle } from 'react-native'

import { SubmittedAccountOp } from '@ambire-common/controllers/activity/activity'
import { getKnownAddressLabels } from '@ambire-common/libs/account/account'
import { HUMANIZER_META_KEY, callsHumanizer } from '@ambire-common/libs/humanizer'
import { HumanizerVisualization, IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { tokenParsing } from '@ambire-common/libs/humanizer/parsers/tokenParsing'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import formatDecimals from '@common/utils/formatDecimals'
import { storage } from '@web/extension-services/background/webapi/storage'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import getStyles from './styles'

interface Props {
  submittedAccountOp: SubmittedAccountOp
  style?: ViewStyle
}

const SubmittedTransactionSummary = ({ submittedAccountOp, style }: Props) => {
  const { styles } = useTheme(getStyles)
  const mainState = useMainControllerState()
  const settingsState = useSettingsControllerState()
  const keystoreState = useKeystoreControllerState()
  const { t } = useTranslation()

  const [humanizedCalls, setHumanizedCalls] = useState<IrCall[]>([])
  const [humanizerError, setHumanizerError] = useState(null)
  const [submittedAccountOpFee, setSubmittedAccountOpFee] = useState<HumanizerVisualization | null>(
    null
  )

  useEffect(() => {
    const knownAddressLabels = getKnownAddressLabels(
      mainState.accounts,
      settingsState.accountPreferences,
      keystoreState.keys,
      settingsState.keyPreferences
    )
    callsHumanizer(
      submittedAccountOp,
      knownAddressLabels,
      storage,
      fetch,
      (calls) => {
        setHumanizedCalls(calls)
      },
      (err: any) => setHumanizerError(err)
    )
  }, [
    submittedAccountOp,
    keystoreState.keys,
    mainState.accounts,
    settingsState.accountPreferences,
    settingsState.keyPreferences
  ])

  const network = useMemo(
    () => settingsState.networks.filter((n) => n.id === submittedAccountOp.networkId)[0],
    [settingsState.networks, submittedAccountOp.networkId]
  )

  const calls = useMemo(() => {
    if (humanizerError) return submittedAccountOp.calls

    return humanizedCalls
  }, [humanizedCalls, humanizerError, submittedAccountOp.calls])

  const feeFormattedValue = useMemo(() => {
    if (!submittedAccountOpFee || !submittedAccountOp.gasFeePayment?.amount) return 'Unknown amount'

    const fee = parseFloat(
      formatUnits(
        submittedAccountOpFee!.amount || submittedAccountOp.gasFeePayment!.amount,
        submittedAccountOpFee.decimals
      )
    )
    return `${formatDecimals(fee)} ${submittedAccountOpFee.symbol}`
  }, [submittedAccountOp.gasFeePayment, submittedAccountOpFee])

  useEffect(() => {
    ;(async () => {
      const meta = await storage.get(HUMANIZER_META_KEY, {})
      const res = tokenParsing(
        {
          humanizerMeta: meta,
          accountAddr: submittedAccountOp.accountAddr,
          networkId: submittedAccountOp.networkId
        },
        [
          {
            type: 'token',
            amount: submittedAccountOp.gasFeePayment?.amount,
            address: submittedAccountOp.gasFeePayment?.inToken
          }
        ]
      )
      setSubmittedAccountOpFee(res?.[0]?.[0])
    })()
  }, [
    submittedAccountOp.accountAddr,
    submittedAccountOp.gasFeePayment?.amount,
    submittedAccountOp.gasFeePayment?.inToken,
    submittedAccountOp.networkId
  ])

  const handleOpenExplorer = useCallback(() => {
    Linking.openURL(`${network.explorerUrl}/tx/${submittedAccountOp.txnId}`)
  }, [network.explorerUrl, submittedAccountOp.txnId])

  return (
    <View style={[styles.container, style]}>
      {calls.map((call: IrCall) => {
        return (
          <TransactionSummary
            key={call.fromUserRequestId}
            style={styles.summaryItem}
            call={call}
            networkId={submittedAccountOp.networkId}
            explorerUrl={network.explorerUrl}
            rightIcon={<OpenIcon />}
            onRightIconPress={handleOpenExplorer}
            isHistory
          />
        )
      })}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text fontSize={14} appearance="secondaryText" weight="semiBold">
            {t('Fee')}:{' '}
          </Text>
          <Text fontSize={14} appearance="secondaryText" style={spacings.mrTy}>
            {feeFormattedValue}
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
          <Text fontSize={14} appearance="secondaryText" style={spacings.mrTy}>
            {new URL(network.explorerUrl).hostname}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default React.memo(SubmittedTransactionSummary)
