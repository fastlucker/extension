import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'

import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useGasTank from '@modules/common/hooks/useGasTank'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePrevious from '@modules/common/hooks/usePrevious'
import useRequests from '@modules/common/hooks/useRequests'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'
import FeeSelector from '@modules/pending-transactions/components/FeeSelector'
import SignActions from '@modules/pending-transactions/components/SignActions'
import SigningWithAccount from '@modules/pending-transactions/components/SigningWithAccount'
import TransactionSummary from '@modules/pending-transactions/components/TransactionSummary'
import useSendTransaction from '@modules/pending-transactions/hooks/useSendTransaction'
import { StackActions } from '@react-navigation/native'

const PendingTransactionsScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { setSendTxnState, sendTxnState, resolveMany, everythingToSign } = useRequests()
  const { account } = useAccounts()
  const { network } = useNetwork()
  const { currentAccGasTankState } = useGasTank()
  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()

  const {
    bundle,
    signingStatus,
    estimation,
    feeSpeed,
    setEstimation,
    setFeeSpeed,
    approveTxn,
    rejectTxn,
    canProceed,
    replacementBundle,
    rejectTxnReplace
  } = useSendTransaction({
    sheetRef,
    openBottomSheet,
    closeBottomSheet,
    isOpen
  })

  const prevBundle: any = usePrevious(bundle)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Pending Transactions: {{numTxns}}', { numTxns: bundle?.txns?.length })
    })
  }, [navigation, bundle?.txns?.length, t])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (sendTxnState.showing) {
        setSendTxnState({ showing: false })
      }
      if (everythingToSign.length) {
        resolveMany([everythingToSign[0].id], {
          message: t('Ambire user rejected the signature request')
        })
      }
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (sendTxnState.showing) {
        setSendTxnState({ showing: false })
      }
      if (everythingToSign.length) {
        resolveMany([everythingToSign[0].id], {
          message: t('Ambire user rejected the signature request')
        })
      }
      navigation.dispatch(StackActions.popToTop())
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    if (prevBundle?.txns?.length && !bundle?.txns?.length) {
      navigation.goBack()
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
            isGasTankEnabled={!!currentAccGasTankState.isEnabled}
          />
        )}
        {!!replacementBundle && (
          <>
            {(!!canProceed || canProceed === null) && (
              <View>
                <Text>{t('This transaction will replace the current pending transaction')}</Text>
              </View>
            )}

            {canProceed === null && (
              <View>
                <Spinner />
              </View>
            )}

            {canProceed === false && (
              <View>
                <View>
                  <Text>
                    {t("The transaction you're trying to replace has already been confirmed")}
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
                estimation={estimation}
                approveTxn={approveTxn}
                rejectTxn={rejectTxn}
                signingStatus={signingStatus}
                feeSpeed={feeSpeed}
                isGasTankEnabled={currentAccGasTankState.isEnabled}
                network={network}
              />
            )}
          </>
        )}
        <BottomSheet
          id="pending-transactions-hardware-wallet"
          sheetRef={sheetRef}
          isOpen={isOpen}
          closeBottomSheet={() => {
            closeBottomSheet()
          }}
          dynamicInitialHeight={false}
        >
          <HardwareWalletSelectConnection
            onSelectDevice={(device: any) => {
              approveTxn({ device })
              closeBottomSheet()
            }}
            shouldWrap={false}
          />
        </BottomSheet>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default PendingTransactionsScreen
