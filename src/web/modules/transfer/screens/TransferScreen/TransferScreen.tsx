import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { FEE_COLLECTOR } from '@ambire-common/consts/addresses'
import { ActionExecutionType } from '@ambire-common/controllers/actions/actions'
import { AddressStateOptional } from '@ambire-common/interfaces/domains'
import { isSmartAccount as getIsSmartAccount } from '@ambire-common/libs/account/account'
import InfoIcon from '@common/assets/svg/InfoIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Checkbox from '@common/components/Checkbox'
import DualChoiceModal from '@common/components/DualChoiceModal'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import useAddressInput from '@common/hooks/useAddressInput'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getAddressFromAddressState } from '@ambire-common/utils/domains'
import { Content, Form, Wrapper } from '@web/components/TransactionsScreen'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useHasGasTank from '@web/hooks/useHasGasTank'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useTransferControllerState from '@web/hooks/useTransferControllerState'
import GasTankInfoModal from '@web/modules/transfer/components/GasTankInfoModal'
import SendForm from '@web/modules/transfer/components/SendForm/SendForm'
import { getUiType } from '@web/utils/uiType'
import Estimation from '@web/modules/sign-account-op/components/OneClick/Estimation'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import Buttons from '@web/modules/sign-account-op/components/OneClick/Buttons'
import BatchAdded from '@web/modules/sign-account-op/components/OneClick/BatchModal/BatchAdded'
import TrackProgress from '@web/modules/sign-account-op/components/OneClick/TrackProgress'
import InProgress from '@web/modules/sign-account-op/components/OneClick/TrackProgress/ByStatus/InProgress'
import Completed from '@web/modules/sign-account-op/components/OneClick/TrackProgress/ByStatus/Completed'
import Failed from '@web/modules/sign-account-op/components/OneClick/TrackProgress/ByStatus/Failed'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import { AccountOpStatus } from '@ambire-common/libs/accountOp/types'
import { getBenzinUrlParams } from '@ambire-common/utils/benzin'

const { isPopup, isTab, isActionWindow } = getUiType()

const TransferScreen = ({ isTopUpScreen }: { isTopUpScreen?: boolean }) => {
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { state } = useTransferControllerState()
  const { statuses: mainCtrlStatuses } = useMainControllerState()
  const {
    isTopUp,
    validationFormMsgs,
    addressState,
    isRecipientHumanizerKnownTokenOrSmartContract,
    isSWWarningVisible,
    isRecipientAddressUnknown,
    isFormValid,
    signAccountOpController,
    latestBroadcastedAccountOp,
    hasProceeded
  } = state

  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account, portfolio } = useSelectedAccountControllerState()
  const isSmartAccount = account ? getIsSmartAccount(account) : false
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const {
    ref: gasTankSheetRef,
    open: openGasTankInfoBottomSheet,
    close: closeGasTankInfoBottomSheet
  } = useModalize()
  const actionsState = useActionsControllerState()
  const { accountsOps } = useActivityControllerState()
  const { hasGasTank } = useHasGasTank({ account })
  const recipientMenuClosedAutomatically = useRef(false)

  const [hasBroadcasted, setHasBroadcasted] = useState(false)
  const [showAddedToBatch, setShowAddedToBatch] = useState(false)

  const submittedAccountOp = useMemo(() => {
    if (!accountsOps.transfer || !latestBroadcastedAccountOp) return

    return accountsOps.transfer.result.items.find(
      (accOp) => accOp.signature === latestBroadcastedAccountOp.signature
    )
  }, [accountsOps.transfer, latestBroadcastedAccountOp?.signature])

  const explorerLink = useMemo(() => {
    if (!submittedAccountOp) return

    const { chainId, identifiedBy, txnId } = submittedAccountOp

    if (!chainId || !identifiedBy || !txnId) return

    return `https://benzin.ambire.com/${getBenzinUrlParams({ chainId, txnId, identifiedBy })}`
  }, [submittedAccountOp])

  useEffect(() => {
    // Optimization: Don't apply filtration if we are not on Activity tab
    if (!latestBroadcastedAccountOp) return

    const sessionId = 'transfer'

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACC_OPS_FILTERS',
      params: {
        sessionId,
        filters: {
          account: latestBroadcastedAccountOp.accountAddr,
          chainId: latestBroadcastedAccountOp.chainId
        },
        pagination: {
          itemsPerPage: 10,
          fromPage: 0
        }
      }
    })

    const killSession = () => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACTIVITY_RESET_ACC_OPS_FILTERS',
        params: { sessionId }
      })
    }

    return () => {
      killSession()
    }
  }, [dispatch, latestBroadcastedAccountOp?.accountAddr, latestBroadcastedAccountOp?.chainId])

  const displayedView: 'transfer' | 'batch' | 'track' = useMemo(() => {
    if (showAddedToBatch) return 'batch'

    if (hasBroadcasted) return 'track'

    return 'transfer'
  }, [hasBroadcasted, showAddedToBatch])

  useEffect(() => {
    const broadcastStatus = mainCtrlStatuses.signAndBroadcastAccountOp

    // We also check the TransferController's latestBroadcastedAccountOp status,
    // otherwise, the hasBroadcasted flag could be set to true
    // if another accountOp from the MainController was broadcasted.
    if (
      broadcastStatus === 'SUCCESS' &&
      latestBroadcastedAccountOp?.status === AccountOpStatus.BroadcastedButNotConfirmed
    ) {
      setHasBroadcasted(true)
    }
  }, [mainCtrlStatuses.signAndBroadcastAccountOp, latestBroadcastedAccountOp?.status])

  // When navigating to another screen internally in the extension, we unload the TransferController
  // to ensure that no estimation or SignAccountOp logic is still running.
  // If the screen is closed entirely, the clean-up is handled by the port.onDisconnect callback in the background.
  useEffect(() => {
    return () => {
      dispatch({ type: 'TRANSFER_CONTROLLER_UNLOAD_SCREEN' })
    }
  }, [dispatch])

  const {
    ref: estimationModalRef,
    open: openEstimationModal,
    close: closeEstimationModal
  } = useModalize()

  const openEstimationModalAndDispatch = useCallback(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_HAS_USER_PROCEEDED',
      params: {
        proceeded: true
      }
    })
    openEstimationModal()
  }, [openEstimationModal, dispatch])

  useEffect(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
      params: { formValues: { isTopUp: !!isTopUpScreen } }
    })
  }, [dispatch, isTopUpScreen])

  /**
   * Single click broadcast
   */
  const handleBroadcastAccountOp = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP',
      params: {
        updateType: 'Transfer&TopUp'
      }
    })
  }, [dispatch])

  const handleUpdateStatus = useCallback(
    (status: SigningStatus) => {
      dispatch({
        type: 'TRANSFER_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE_STATUS',
        params: {
          status
        }
      })
    },
    [dispatch]
  )
  const updateController = useCallback(
    (params: { signingKeyAddr?: string; signingKeyType?: string }) => {
      dispatch({
        type: 'TRANSFER_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params
      })
    },
    [dispatch]
  )

  const doesUserMeetMinimumBalanceForGasTank = useMemo(() => {
    return portfolio.totalBalance >= 10
  }, [portfolio.totalBalance])

  const setAddressState = useCallback(
    (newPartialAddressState: AddressStateOptional) => {
      dispatch({
        type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
        params: { formValues: { addressState: newPartialAddressState } }
      })
    },
    [dispatch]
  )

  const handleCacheResolvedDomain = useCallback(
    (address: string, domain: string, type: 'ens') => {
      dispatch({
        type: 'DOMAINS_CONTROLLER_SAVE_RESOLVED_REVERSE_LOOKUP',
        params: {
          type,
          address,
          name: domain
        }
      })
    },
    [dispatch]
  )

  const addressInputState = useAddressInput({
    addressState,
    setAddressState,
    overwriteError:
      state?.isInitialized && !validationFormMsgs.recipientAddress.success
        ? validationFormMsgs.recipientAddress.message
        : '',
    overwriteValidLabel: validationFormMsgs?.recipientAddress.success
      ? validationFormMsgs.recipientAddress.message
      : '',
    addToast,
    handleCacheResolvedDomain
  })

  const isFormEmpty = useMemo(() => {
    return (!state.amount && !state.recipientAddress) || !state.selectedToken
  }, [state.amount, state.recipientAddress, state.selectedToken])

  const submitButtonText = useMemo(() => (isTopUp ? t('Top Up') : t('Send')), [isTopUp, t])

  const isTransferFormValid = useMemo(
    () => !!(isTopUp ? isFormValid : isFormValid && !addressInputState.validation.isError),
    [addressInputState.validation.isError, isFormValid, isTopUp]
  )

  const onBack = useCallback(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_RESET_FORM'
    })
    navigate(ROUTES.dashboard)
  }, [navigate, dispatch])

  const resetTransferForm = useCallback(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_RESET_FORM'
    })
    recipientMenuClosedAutomatically.current = false
  }, [dispatch])

  const addTransaction = useCallback(
    (actionExecutionType: ActionExecutionType) => {
      if (isFormValid && state.selectedToken) {
        if (actionExecutionType === 'queue' && !state.shouldSkipTransactionQueuedModal) {
          openBottomSheet()
        }

        // Proceed in OneClick txn
        if (actionExecutionType === 'open-action-window') {
          openEstimationModalAndDispatch()
          return
        }

        // Batch
        dispatch({
          type: 'MAIN_CONTROLLER_BUILD_TRANSFER_USER_REQUEST',
          params: {
            amount: state.amount,
            selectedToken: state.selectedToken,
            recipientAddress: isTopUp ? FEE_COLLECTOR : getAddressFromAddressState(addressState),
            actionExecutionType
          }
        })
        // TODO - comment
        if (state.shouldSkipTransactionQueuedModal) {
          setShowAddedToBatch(true)
        }

        resetTransferForm()
      }
    },
    [
      state,
      addressState,
      isTopUp,
      state.amount,
      state.selectedToken,
      isFormEmpty,
      actionsState,
      isFormValid,
      dispatch,
      openBottomSheet,
      resetTransferForm
    ]
  )

  const handleGasTankInfoPressed = useCallback(
    () => openGasTankInfoBottomSheet(),
    [openGasTankInfoBottomSheet]
  )

  const gasTankLabelWithInfo = useMemo(() => {
    return (
      <View style={flexbox.directionRow}>
        <Text
          fontSize={20}
          weight="medium"
          appearance="primaryText"
          numberOfLines={1}
          style={spacings.mrMi}
        >
          {t('Top Up Gas Tank')}
        </Text>
        <Pressable style={[flexbox.center]} onPress={handleGasTankInfoPressed}>
          <InfoIcon width={20} height={20} />
        </Pressable>
      </View>
    )
  }, [handleGasTankInfoPressed, t])

  // Title shown in BottomSheet header
  const headerTitle = useMemo(
    () => (state.isTopUp ? gasTankLabelWithInfo : t('Send')),
    [state.isTopUp, gasTankLabelWithInfo, t]
  )

  // Title shown before SendToken component
  const formTitle = useMemo(() => {
    if (state.isTopUp) {
      if (isPopup) {
        return t('Top Up')
      }

      return gasTankLabelWithInfo
    }

    return t('Send')
  }, [state.isTopUp, t, gasTankLabelWithInfo])

  const buttons = useMemo(() => {
    return (
      <>
        {isTab && <BackButton onPress={onBack} />}
        <Buttons
          token={state.selectedToken}
          handleSubmitForm={(isOneClickMode) =>
            addTransaction(isOneClickMode ? 'open-action-window' : 'queue')
          }
          proceedBtnText={submitButtonText}
          isNotReadyToProceed={!isTransferFormValid}
          signAccountOpErrors={[]}
        />
      </>
    )
  }, [
    state.selectedToken,
    addTransaction,
    isTopUp,
    onBack,
    submitButtonText,
    isTransferFormValid,
    t
  ])

  const handleGoBackPress = useCallback(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_RESET_FORM'
    })
    navigate(ROUTES.dashboard)
  }, [navigate, dispatch])

  const onBatchAddedPrimaryButtonPress = useCallback(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_DESTROY_LATEST_BROADCASTED_ACCOUNT_OP'
    })
    navigate(WEB_ROUTES.dashboard)
  }, [navigate])
  const onBatchAddedSecondaryButtonPress = useCallback(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_DESTROY_LATEST_BROADCASTED_ACCOUNT_OP'
    })
    setShowAddedToBatch(false)
  }, [setShowAddedToBatch])

  const onPrimaryButtonPress = useCallback(() => {
    if (isActionWindow) {
      dispatch({
        type: 'CLOSE_SIGNING_ACTION_WINDOW',
        params: {
          type: 'transfer'
        }
      })
    } else {
      navigate(WEB_ROUTES.dashboard)
    }

    dispatch({
      type: 'TRANSFER_CONTROLLER_RESET_FORM'
    })
  }, [dispatch, navigate])

  console.log({ displayedView })

  if (displayedView === 'track') {
    return (
      <TrackProgress
        title={isTopUp ? t('Top Up Gas Tank') : t('Send')}
        onPrimaryButtonPress={onPrimaryButtonPress}
        secondaryButtonText={isTopUp ? t('Top up again?') : t('Sending more?')}
        handleClose={() => {
          dispatch({
            type: 'TRANSFER_CONTROLLER_DESTROY_LATEST_BROADCASTED_ACCOUNT_OP'
          })
          setHasBroadcasted(false)
        }}
      >
        {submittedAccountOp?.status === AccountOpStatus.BroadcastedButNotConfirmed && (
          <InProgress title={isTopUp ? t('Confirming your top up') : t('Confirming your transfer')}>
            {t('Almost there!')}
          </InProgress>
        )}
        {(submittedAccountOp?.status === AccountOpStatus.Success ||
          submittedAccountOp?.status === AccountOpStatus.UnknownButPastNonce) && (
          <Completed
            title={isTopUp ? t('Top up ready!') : t('Transfer done!')}
            titleSecondary={
              isTopUp
                ? t('You can now use your gas tank')
                : t('{{symbol}} delivered - like magic.', {
                    symbol: state.latestBroadcastedToken?.symbol || 'Token'
                  })
            }
            explorerLink={explorerLink}
            openExplorerText="View Transfer"
          />
        )}
        {(submittedAccountOp?.status === AccountOpStatus.Failure ||
          submittedAccountOp?.status === AccountOpStatus.Rejected ||
          submittedAccountOp?.status === AccountOpStatus.BroadcastButStuck) && (
          <Failed title={t('Something went wrong!')} errorMessage="TODO error message" />
        )}
      </TrackProgress>
    )
  }

  if (displayedView === 'batch') {
    return (
      <BatchAdded
        title={isTopUp ? t('Top Up Gas Tank') : t('Send')}
        secondaryButtonText={isTopUp ? t('Top up again?') : t('Sending more?')}
        onPrimaryButtonPress={onBatchAddedPrimaryButtonPress}
        onSecondaryButtonPress={onBatchAddedSecondaryButtonPress}
      />
    )
  }

  return (
    <Wrapper title={headerTitle} handleGoBack={handleGoBackPress} buttons={buttons}>
      <Content buttons={buttons}>
        {state?.isInitialized ? (
          <Form>
            <SendForm
              addressInputState={addressInputState}
              isSmartAccount={isSmartAccount}
              hasGasTank={hasGasTank}
              amountErrorMessage={validationFormMsgs.amount.message || ''}
              isRecipientAddressUnknown={isRecipientAddressUnknown}
              isRecipientHumanizerKnownTokenOrSmartContract={
                isRecipientHumanizerKnownTokenOrSmartContract
              }
              isSWWarningVisible={isSWWarningVisible}
              recipientMenuClosedAutomaticallyRef={recipientMenuClosedAutomatically}
              formTitle={formTitle}
            />
            {isTopUp && !hasGasTank && (
              <View style={spacings.ptLg}>
                <Alert
                  type="warning"
                  title={
                    <Trans>
                      The Gas Tank is exclusively available for Smart Accounts. It lets you pre-pay
                      for network fees using stable coins and other tokens and use the funds on any
                      chain.{' '}
                      <Pressable
                        onPress={async () => {
                          try {
                            await createTab(
                              'https://help.ambire.com/hc/en-us/articles/5397969913884-What-is-the-Gas-Tank'
                            )
                          } catch {
                            addToast("Couldn't open link", { type: 'error' })
                          }
                        }}
                      >
                        <Text appearance="warningText" underline>
                          {t('Learn more')}
                        </Text>
                      </Pressable>
                      .
                    </Trans>
                  }
                  isTypeLabelHidden
                />
              </View>
            )}
            {isTopUp && hasGasTank && (
              <View style={spacings.ptLg}>
                <Alert
                  type="warning"
                  title={t('Gas Tank deposits cannot be withdrawn')}
                  text={
                    !doesUserMeetMinimumBalanceForGasTank
                      ? t(
                          'Note: A minimum overall balance of $10 is required to pay for gas via the Gas Tank'
                        )
                      : false
                  }
                  isTypeLabelHidden
                />
              </View>
            )}
          </Form>
        ) : (
          <SkeletonLoader
            width={640}
            height={420}
            appearance="primaryBackground"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        )}
      </Content>
      <BottomSheet
        id="import-seed-phrase"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        backgroundColor="secondaryBackground"
        style={{ overflow: 'hidden', width: 496, ...spacings.ph0, ...spacings.pv0 }}
        type="modal"
      >
        <DualChoiceModal
          title={t('Transaction added to batch')}
          description={
            <View>
              <Text style={spacings.mbTy} appearance="secondaryText">
                {t(
                  'You can now add more transactions on this network and send them batched all together for signing.'
                )}
              </Text>
              <Text appearance="secondaryText" style={spacings.mbLg}>
                {t('All pending batch transactions are available on your Dashboard.')}
              </Text>
              <Checkbox
                value={state.shouldSkipTransactionQueuedModal}
                onValueChange={() => {
                  dispatch({
                    type: 'TRANSFER_CONTROLLER_SHOULD_SKIP_TRANSACTION_QUEUED_MODAL',
                    params: {
                      shouldSkip: true
                    }
                  })
                }}
                uncheckedBorderColor={theme.secondaryText}
                label={t("Don't show this modal again")}
                labelProps={{
                  style: {
                    color: theme.secondaryText
                  },
                  weight: 'medium'
                }}
                style={spacings.mb0}
              />
            </View>
          }
          primaryButtonText={t('Got it')}
          primaryButtonTestID="queue-modal-got-it-button"
          onPrimaryButtonPress={() => {
            closeBottomSheet()
            setShowAddedToBatch(true)
          }}
          onCloseIconPress={() => setShowAddedToBatch(true)}
        />
      </BottomSheet>
      <GasTankInfoModal
        id="gas-tank-info"
        sheetRef={gasTankSheetRef}
        closeBottomSheet={closeGasTankInfoBottomSheet}
        onPrimaryButtonPress={closeGasTankInfoBottomSheet}
        portfolio={portfolio}
        account={account}
      />
      <Estimation
        updateType="Transfer&TopUp"
        estimationModalRef={estimationModalRef}
        closeEstimationModal={closeEstimationModal}
        updateController={updateController}
        handleUpdateStatus={handleUpdateStatus}
        handleBroadcastAccountOp={handleBroadcastAccountOp}
        hasProceeded={hasProceeded}
        signAccountOpController={signAccountOpController}
      />
    </Wrapper>
  )
}

export default React.memo(TransferScreen)
