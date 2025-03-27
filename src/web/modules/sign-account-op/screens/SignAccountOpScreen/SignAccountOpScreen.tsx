import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { AccountOpAction } from '@ambire-common/controllers/actions/actions'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import Alert from '@common/components/Alert'
import BottomSheet from '@common/components/BottomSheet'
import DualChoiceWarningModal from '@common/components/DualChoiceWarningModal'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { closeCurrentWindow } from '@web/extension-services/background/webapi/window'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import useLedger from '@web/modules/hardware-wallet/hooks/useLedger'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import Footer from '@web/modules/sign-account-op/components/Footer'
import PendingTransactions from '@web/modules/sign-account-op/components/PendingTransactions'
import SafetyChecksOverlay from '@web/modules/sign-account-op/components/SafetyChecksOverlay'
import SignAccountOpHardwareWalletSigningModal from '@web/modules/sign-account-op/components/SignAccountOpHardwareWalletSigningModal'
import Simulation from '@web/modules/sign-account-op/components/Simulation'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'

import getStyles from './styles'

const SignAccountOpScreen = () => {
  const actionsState = useActionsControllerState()
  const signAccountOpState = useSignAccountOpControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { networks } = useNetworksControllerState()
  const { styles } = useTheme(getStyles)
  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)
  const [shouldDisplayLedgerConnectModal, setShouldDisplayLedgerConnectModal] = useState(false)
  const prevIsChooseSignerShown = usePrevious(isChooseSignerShown)
  const { isLedgerConnected } = useLedger()
  const [slowRequest, setSlowRequest] = useState<boolean>(false)
  const [slowPaymasterRequest, setSlowPaymasterRequest] = useState<boolean>(false)
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<string[]>([])
  const {
    ref: warningAgreementModalRef,
    open: openWarningAgreementModal,
    close: closeWarningAgreementModal
  } = useModalize()
  const { maxWidthSize } = useWindowSize()
  const hasEstimation = useMemo(
    () =>
      signAccountOpState?.isInitialized &&
      !!signAccountOpState?.gasPrices &&
      !signAccountOpState.estimation.error,
    [
      signAccountOpState?.estimation?.error,
      signAccountOpState?.gasPrices,
      signAccountOpState?.isInitialized
    ]
  )

  useEffect(() => {
    // Ensures user can re-open the modal, if previously being closed, e.g.
    // there is an error (modal closed), but user opts-in sign again (open it).
    const isModalStillOpen = isChooseSignerShown && prevIsChooseSignerShown
    // These errors get displayed in the UI (in the <Warning /> component),
    // so in case of an error, closing the signer key selection modal is needed,
    // otherwise errors will be displayed behind the modal overlay.
    if (isModalStillOpen && !!signAccountOpState?.errors.length) {
      setIsChooseSignerShown(false)
    }
  }, [isChooseSignerShown, prevIsChooseSignerShown, signAccountOpState?.errors.length])

  const isSignLoading =
    signAccountOpState?.status?.type === SigningStatus.InProgress ||
    signAccountOpState?.status?.type === SigningStatus.UpdatesPaused ||
    signAccountOpState?.status?.type === SigningStatus.WaitingForPaymaster ||
    signAccountOpState?.status?.type === SigningStatus.Done

  useEffect(() => {
    if (signAccountOpState?.estimation.estimationRetryError) {
      setSlowRequest(false)
      return
    }
    const timeout = setTimeout(() => {
      // set the request to slow if the state is not init (no estimation)
      // or the gas prices haven't been fetched
      if (!signAccountOpState?.isInitialized || !signAccountOpState?.gasPrices) {
        setSlowRequest(true)
      }
    }, 5000)

    if (signAccountOpState?.isInitialized && !!signAccountOpState?.gasPrices) {
      clearTimeout(timeout)
      setSlowRequest(false)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [
    signAccountOpState?.isInitialized,
    signAccountOpState?.gasPrices,
    signAccountOpState?.estimation.estimationRetryError
  ])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (signAccountOpState?.status?.type === SigningStatus.WaitingForPaymaster) {
        setSlowPaymasterRequest(true)
      }
    }, 3000)

    if (signAccountOpState?.status?.type !== SigningStatus.WaitingForPaymaster) {
      clearTimeout(timeout)
      setSlowPaymasterRequest(false)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [signAccountOpState?.status?.type])

  const accountOpAction = useMemo(() => {
    if (actionsState.currentAction?.type !== 'accountOp') return undefined
    return actionsState.currentAction as AccountOpAction
  }, [actionsState.currentAction])

  useEffect(() => {
    if (accountOpAction?.id) {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_INIT',
        params: { actionId: accountOpAction.id }
      })
    }
  }, [accountOpAction?.id, dispatch])

  const network = useMemo(() => {
    return networks.find((n) => n.chainId === signAccountOpState?.accountOp?.chainId)
  }, [networks, signAccountOpState?.accountOp?.chainId])

  const handleRejectAccountOp = useCallback(() => {
    if (!accountOpAction) return

    dispatch({
      type: 'MAIN_CONTROLLER_REJECT_ACCOUNT_OP',
      params: {
        err: 'User rejected the transaction request.',
        actionId: accountOpAction.id,
        shouldOpenNextAction: true
      }
    })
  }, [dispatch, accountOpAction])

  const handleAddToCart = useCallback(() => {
    closeCurrentWindow()
  }, [])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_DESTROY' })
    }
  }, [dispatch])

  const signingKeyType = signAccountOpState?.accountOp?.signingKeyType
  const feePayerKeyType = mainState.feePayerKey?.type
  const isAtLeastOneOfTheKeysInvolvedLedger =
    signingKeyType === 'ledger' || feePayerKeyType === 'ledger'

  const updateControllerSigningStatus = useCallback(
    (status: SigningStatus) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE_STATUS',
        params: {
          status
        }
      })
    },
    [dispatch]
  )

  const handleDismissLedgerConnectModal = useCallback(() => {
    setShouldDisplayLedgerConnectModal(false)

    // Resume if paused (might happen if user have acknowledged warnings, but
    // opts in to sign with Ledger, but a Ledger is NOT connected yet).
    if (signAccountOpState?.status?.type === SigningStatus.UpdatesPaused)
      updateControllerSigningStatus(SigningStatus.ReadyToSign)
  }, [signAccountOpState?.status?.type, updateControllerSigningStatus])

  const warningToPromptBeforeSign = useMemo(
    () =>
      signAccountOpState?.warnings.find(
        (warning) => warning.promptBeforeSign && !acknowledgedWarnings.includes(warning.id)
      ),
    [acknowledgedWarnings, signAccountOpState?.warnings]
  )

  const handleSign = useCallback(
    (_chosenSigningKeyType?: string, _warningAccepted?: boolean) => {
      // Prioritize warning(s) modals over all others
      if (warningToPromptBeforeSign && !_warningAccepted) {
        openWarningAgreementModal()
        updateControllerSigningStatus(SigningStatus.UpdatesPaused)
        return
      }

      const isLedgerKeyInvolvedInTheJustChosenKeys = _chosenSigningKeyType
        ? _chosenSigningKeyType === 'ledger' || feePayerKeyType === 'ledger'
        : isAtLeastOneOfTheKeysInvolvedLedger

      if (isLedgerKeyInvolvedInTheJustChosenKeys && !isLedgerConnected) {
        setShouldDisplayLedgerConnectModal(true)
        updateControllerSigningStatus(SigningStatus.UpdatesPaused)
        return
      }

      dispatch({ type: 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP' })
    },
    [
      dispatch,
      feePayerKeyType,
      isAtLeastOneOfTheKeysInvolvedLedger,
      isLedgerConnected,
      openWarningAgreementModal,
      updateControllerSigningStatus,
      warningToPromptBeforeSign
    ]
  )

  const handleChangeSigningKey = useCallback(
    (signingKeyAddr: string, _chosenSigningKeyType: string) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: { signingKeyAddr, signingKeyType: _chosenSigningKeyType }
      })

      // Explicitly pass the currently selected signing key type, because
      // the signing key type in the state might not be updated yet,
      // and Sign Account Op controller assigns a default signing upfront
      handleSign(_chosenSigningKeyType)
    },
    [dispatch, handleSign]
  )

  const onSignButtonClick = useCallback(() => {
    if (!signAccountOpState) return

    // If the account has only one signer, we don't need to show the select signer overlay,
    // and we will sign the transaction with the only one available signer (it is set by default in the controller).
    if (signAccountOpState?.accountKeyStoreKeys.length === 1) {
      handleSign()
      return
    }

    setIsChooseSignerShown(true)
  }, [signAccountOpState, handleSign])

  const acknowledgeWarning = useCallback(() => {
    if (!warningToPromptBeforeSign) return

    setAcknowledgedWarnings((prev) => [...prev, warningToPromptBeforeSign.id])
    closeWarningAgreementModal()
    handleSign(undefined, true)
  }, [warningToPromptBeforeSign, closeWarningAgreementModal, handleSign])

  useEffect(() => {
    if (shouldDisplayLedgerConnectModal && isLedgerConnected) {
      handleDismissLedgerConnectModal()
    }
  }, [handleDismissLedgerConnectModal, shouldDisplayLedgerConnectModal, isLedgerConnected])

  const dismissWarning = useCallback(() => {
    updateControllerSigningStatus(SigningStatus.ReadyToSign)

    closeWarningAgreementModal()
  }, [updateControllerSigningStatus, closeWarningAgreementModal])

  const isViewOnly = useMemo(
    () => signAccountOpState?.accountKeyStoreKeys.length === 0,
    [signAccountOpState?.accountKeyStoreKeys]
  )

  const renderedButNotNecessarilyVisibleModal: 'warnings' | 'ledger-connect' | 'hw-sign' | null =
    useMemo(() => {
      // Prioritize warning(s) modals over all others
      if (warningToPromptBeforeSign) return 'warnings'

      if (shouldDisplayLedgerConnectModal) return 'ledger-connect'

      const isAtLeastOneOfTheKeysInvolvedExternal =
        (!!signingKeyType && signingKeyType !== 'internal') ||
        (!!feePayerKeyType && feePayerKeyType !== 'internal')

      if (isAtLeastOneOfTheKeysInvolvedExternal) return 'hw-sign'

      return null
    }, [
      feePayerKeyType,
      shouldDisplayLedgerConnectModal,
      signingKeyType,
      warningToPromptBeforeSign
    ])

  // When being done, there is a corner case if the sign succeeds, but the broadcast fails.
  // If so, the "Sign" button should NOT be disabled, so the user can retry broadcasting.
  const notReadyToSignButAlsoNotDone =
    !signAccountOpState?.readyToSign && signAccountOpState?.status?.type !== SigningStatus.Done

  if (mainState.signAccOpInitError) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Alert type="error" title={mainState.signAccOpInitError} />
      </View>
    )
  }

  const isInsufficientFundsForGas = useMemo(() => {
    if (!signAccountOpState?.feeSpeeds || !signAccountOpState.selectedOption) {
      return false
    }

    const keys = Object.keys(signAccountOpState.feeSpeeds)
    if (!keys.length) return false

    const speeds = signAccountOpState.feeSpeeds[keys[0]]
    if (!Array.isArray(speeds)) return false

    const { availableAmount } = signAccountOpState.selectedOption

    return speeds.every((speed) => availableAmount < speed.amount)
  }, [signAccountOpState])

  const isAddToCartDisabled = useMemo(() => {
    const readyToSign = signAccountOpState?.readyToSign

    return isSignLoading || (!readyToSign && !isViewOnly && !isInsufficientFundsForGas)
  }, [isInsufficientFundsForGas, isSignLoading, isViewOnly, signAccountOpState?.readyToSign])

  return (
    <>
      {renderedButNotNecessarilyVisibleModal === 'warnings' && (
        <BottomSheet
          id="dual-choice"
          closeBottomSheet={dismissWarning}
          sheetRef={warningAgreementModalRef}
          style={styles.warningsModal}
        >
          {warningToPromptBeforeSign && (
            <DualChoiceWarningModal
              title={t(warningToPromptBeforeSign.title)}
              description={t(warningToPromptBeforeSign.text || '')}
              primaryButtonText={t('Proceed')}
              secondaryButtonText={t('Cancel')}
              onPrimaryButtonPress={acknowledgeWarning}
              onSecondaryButtonPress={dismissWarning}
            />
          )}
        </BottomSheet>
      )}
      <SafetyChecksOverlay
        shouldBeVisible={
          !signAccountOpState?.estimation.estimation || !signAccountOpState?.isInitialized
        }
      />
      <TabLayoutContainer
        width="full"
        header={<HeaderAccountAndNetworkInfo />}
        footer={
          <Footer
            onReject={handleRejectAccountOp}
            onAddToCart={handleAddToCart}
            isAddToCartDisplayed={!!signAccountOpState && !!network}
            isSignLoading={isSignLoading}
            isSignDisabled={
              isViewOnly ||
              isSignLoading ||
              notReadyToSignButAlsoNotDone ||
              !signAccountOpState.readyToSign
            }
            // Allow view only accounts or if no funds for gas to add to cart even if the txn is not ready to sign
            // because they can't sign it anyway

            isAddToCartDisabled={isAddToCartDisabled}
            onSign={onSignButtonClick}
            inProgressButtonText={
              signAccountOpState?.status?.type === SigningStatus.WaitingForPaymaster
                ? t('Sending...')
                : t('Signing...')
            }
          />
        }
      >
        {signAccountOpState ? (
          <SigningKeySelect
            isVisible={isChooseSignerShown}
            isSigning={isSignLoading || !signAccountOpState.readyToSign}
            handleClose={() => setIsChooseSignerShown(false)}
            selectedAccountKeyStoreKeys={signAccountOpState.accountKeyStoreKeys}
            handleChooseSigningKey={handleChangeSigningKey}
            account={signAccountOpState.account}
          />
        ) : null}
        <TabLayoutWrapperMainContent scrollEnabled={false}>
          <View style={styles.container}>
            <View style={styles.leftSideContainer}>
              <Simulation
                network={network}
                isEstimationComplete={!!signAccountOpState?.isInitialized && !!network}
              />
              <PendingTransactions network={network} />
            </View>
            <View style={[styles.separator, maxWidthSize('xl') ? spacings.mh3Xl : spacings.mhXl]} />
            <Estimation
              signAccountOpState={signAccountOpState}
              disabled={isSignLoading}
              hasEstimation={!!hasEstimation}
              slowRequest={slowRequest}
              slowPaymasterRequest={slowPaymasterRequest}
              isViewOnly={isViewOnly}
              isSponsored={signAccountOpState ? signAccountOpState.isSponsored : false}
              sponsor={signAccountOpState ? signAccountOpState.sponsor : undefined}
            />

            {renderedButNotNecessarilyVisibleModal === 'hw-sign' && (
              <SignAccountOpHardwareWalletSigningModal
                signingKeyType={signingKeyType}
                feePayerKeyType={feePayerKeyType}
                broadcastSignedAccountOpStatus={mainState.statuses.broadcastSignedAccountOp}
                signAccountOpStatusType={signAccountOpState?.status?.type}
              />
            )}

            {renderedButNotNecessarilyVisibleModal === 'ledger-connect' && (
              <LedgerConnectModal
                isVisible={shouldDisplayLedgerConnectModal}
                handleClose={handleDismissLedgerConnectModal}
                displayOptionToAuthorize={false}
              />
            )}
          </View>
        </TabLayoutWrapperMainContent>
      </TabLayoutContainer>
    </>
  )
}

export default React.memo(SignAccountOpScreen)
