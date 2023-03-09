import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import useAccounts from '@common/hooks/useAccounts'
import useGasTank from '@common/hooks/useGasTank'
import useNavigation from '@common/hooks/useNavigation'
import useNetwork from '@common/hooks/useNetwork'
import useRequests from '@common/hooks/useRequests'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import isInt from '@common/utils/isInt'
import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import HardwareWalletSelectConnection from '@mobile/hardware-wallet/components/HardwareWalletSelectConnection'
import FeeSelector from '@mobile/pending-transactions/components/FeeSelector'
import SignActions from '@mobile/pending-transactions/components/SignActions'
import SigningWithAccount from '@mobile/pending-transactions/components/SigningWithAccount'
import TransactionSummary from '@mobile/pending-transactions/components/TransactionSummary'
import useSendTransaction from '@mobile/pending-transactions/hooks/useSendTransaction'
import { getUiType } from '@web/utils/uiType'

const relayerURL = CONFIG.RELAYER_URL

const PendingTransactionsScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { setSendTxnState, sendTxnState, resolveMany, everythingToSign } = useRequests()
  const { account } = useAccounts()
  const { network } = useNetwork()
  const { currentAccGasTankState } = useGasTank()
  const {
    ref: hardwareWalletSheetRef,
    open: hardwareWalletOpenBottomSheet,
    close: hardwareWalletCloseBottomSheet
  } = useModalize()

  if (getUiType().isNotification) {
    navigation.navigate = () => null
    navigation.goBack = () => null
  }

  const {
    bundle,
    signingStatus,
    estimation,
    feeSpeed,
    rejectTxn,
    canProceed,
    replaceTx,
    mustReplaceNonce,
    setEstimation,
    setFeeSpeed,
    approveTxn,
    rejectTxnReplace,
    setReplaceTx
  } = useSendTransaction({
    hardwareWalletOpenBottomSheet
  })

  const prevBundle: any = usePrevious(bundle)

  useLayoutEffect(() => {
    navigation?.setOptions({
      headerTitle: t('Pending Transactions: {{numTxns}}', { numTxns: bundle?.txns?.length })
    })
  }, [navigation, bundle?.txns?.length, t])

  useEffect(() => {
    return () => {
      if (sendTxnState.showing) {
        setSendTxnState({ showing: false })
      }
      if (everythingToSign.length) {
        resolveMany([everythingToSign[0].id], {
          message: t('Ambire user rejected the signature request')
        })
      }
    }
  }, [everythingToSign, resolveMany, sendTxnState.showing, setSendTxnState, t])

  useEffect(() => {
    if (prevBundle?.txns?.length && !bundle?.txns?.length) {
      navigation?.goBack()
    }
  })

  if (!account || !bundle?.txns?.length)
    return (
      <GradientBackgroundWrapper>
        <Wrapper>
          <Text style={{ color: 'red' }}>
            {t('SendTransactions: No account or no requests: should never happen.')}
          </Text>
        </Wrapper>
      </GradientBackgroundWrapper>
    )

  return (
    <GradientBackgroundWrapper>
      <Wrapper type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW} extraHeight={190}>
        <SigningWithAccount />
        <TransactionSummary bundle={bundle} estimation={estimation} />
        {!!canProceed && (
          <FeeSelector
            disabled={
              signingStatus && signingStatus.finalBundle && !(estimation && !estimation.success)
            }
            signer={bundle.signer}
            estimation={estimation}
            setEstimation={setEstimation}
            feeSpeed={feeSpeed}
            setFeeSpeed={setFeeSpeed}
            network={network}
            isGasTankEnabled={currentAccGasTankState.isEnabled && !!relayerURL}
          />
        )}
        {isInt(mustReplaceNonce) && (
          <>
            {(!!canProceed || canProceed === null) && (
              <Text style={[spacings.mbTy, spacings.phSm]} fontSize={12}>
                {t('This transaction will replace the current pending transaction.')}
              </Text>
            )}

            {canProceed === null && (
              <View style={flexboxStyles.alignCenter}>
                <Spinner />
              </View>
            )}

            {canProceed === false && (
              <View>
                <View>
                  <Text style={[spacings.mbSm, spacings.phSm]} fontSize={12}>
                    {t("The transaction you're trying to replace has already been confirmed.")}
                  </Text>
                </View>

                <Button type="danger" text={t('Close')} onPress={rejectTxnReplace} />
              </View>
            )}
          </>
        )}
        {!!canProceed && (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {!!bundle?.signer?.quickAccManager && !CONFIG.RELAYER_URL ? (
              <Text fontSize={16} appearance="danger">
                {t(
                  'Signing transactions with an email/password account without being connected to the relayer is unsupported.'
                )}
              </Text>
            ) : (
              <SignActions
                bundle={bundle}
                mustReplaceNonce={mustReplaceNonce}
                replaceTx={replaceTx}
                setReplaceTx={setReplaceTx}
                estimation={estimation}
                approveTxn={approveTxn}
                rejectTxn={rejectTxn}
                signingStatus={signingStatus}
                feeSpeed={feeSpeed}
                isGasTankEnabled={currentAccGasTankState.isEnabled && !!relayerURL}
                network={network}
              />
            )}
          </>
        )}
        <BottomSheet
          id="pending-transactions-hardware-wallet"
          sheetRef={hardwareWalletSheetRef}
          closeBottomSheet={() => {
            hardwareWalletCloseBottomSheet()
          }}
        >
          <HardwareWalletSelectConnection
            onSelectDevice={(device: any) => {
              approveTxn({ device })
              hardwareWalletCloseBottomSheet()
            }}
            shouldWrap={false}
          />
        </BottomSheet>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default PendingTransactionsScreen
