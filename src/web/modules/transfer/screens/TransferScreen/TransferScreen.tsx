import React, { useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { FEE_COLLECTOR } from '@ambire-common/consts/addresses'
import { AddressStateOptional } from '@ambire-common/interfaces/domains'
import { isSmartAccount as getIsSmartAccount } from '@ambire-common/libs/account/account'
import { ENTRY_POINT_AUTHORIZATION_REQUEST_ID } from '@ambire-common/libs/userOperation/userOperation'
import CartIcon from '@common/assets/svg/CartIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import DualChoiceModal from '@common/components/DualChoiceModal'
import Panel from '@common/components/Panel'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import useAddressInput from '@common/hooks/useAddressInput'
import useConnectivity from '@common/hooks/useConnectivity'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getAddressFromAddressState } from '@common/utils/domains'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useTransferControllerState from '@web/hooks/useTransferControllerState'
import SendForm from '@web/modules/transfer/components/SendForm/SendForm'

import getStyles from './styles'

const TransferScreen = () => {
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { isOffline } = useConnectivity()
  const { state, transferCtrl } = useTransferControllerState()
  const {
    isTopUp,
    validationFormMsgs,
    addressState,
    isRecipientHumanizerKnownTokenOrSmartContract,
    isSWWarningVisible,
    isRecipientAddressUnknown,
    isFormValid
  } = state
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { account } = useSelectedAccountControllerState()
  const isSmartAccount = account ? getIsSmartAccount(account) : false
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { userRequests } = useMainControllerState()
  const actionsState = useActionsControllerState()

  const hasOpenedActionWindow = useMemo(
    () => actionsState.currentAction || actionsState.actionWindow.id,
    [actionsState.currentAction, actionsState.actionWindow.id]
  )

  const transactionUserRequests = useMemo(() => {
    return userRequests.filter(
      (r) => r.action.kind === 'calls' && r.meta.accountAddr === account?.addr
    )
  }, [account, userRequests])

  const setAddressState = useCallback(
    (newPartialAddressState: AddressStateOptional) => {
      transferCtrl.update({ addressState: newPartialAddressState })
    },
    [transferCtrl]
  )

  const handleCacheResolvedDomain = useCallback(
    (address: string, domain: string, type: 'ens' | 'ud') => {
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
    return (!transferCtrl.amount && !transferCtrl.recipientAddress) || !transferCtrl.selectedToken
  }, [transferCtrl.amount, transferCtrl.recipientAddress, transferCtrl.selectedToken])

  const submitButtonText = useMemo(() => {
    if (isOffline) return t("You're offline")
    if (isTopUp) return t('Top Up')

    if (hasOpenedActionWindow || !isSmartAccount) return t('Send')

    let numOfRequests = transactionUserRequests.length
    if (isFormValid && !addressInputState.validation.isError) {
      numOfRequests++
    }

    if (numOfRequests) {
      if (isFormEmpty) return t('Sign All Pending ({{count}})', { count: numOfRequests })
      return t('Send ({{count}})', { count: numOfRequests })
    }

    return t('Send')
  }, [
    isOffline,
    isTopUp,
    transactionUserRequests,
    addressInputState.validation.isError,
    isFormValid,
    isFormEmpty,
    isSmartAccount,
    hasOpenedActionWindow,
    t
  ])

  const isSendButtonDisabled = useMemo(() => {
    if (isOffline) return true
    if (isTopUp) return !isFormValid

    const isTransferFormValid = isFormValid && !addressInputState.validation.isError

    if (!isSmartAccount) return !isTransferFormValid

    if (transactionUserRequests.length && !hasOpenedActionWindow) {
      return !isFormEmpty && !isTransferFormValid
    }
    return !isTransferFormValid
  }, [
    addressInputState.validation.isError,
    isFormEmpty,
    isFormValid,
    isOffline,
    isTopUp,
    isSmartAccount,
    transactionUserRequests.length,
    hasOpenedActionWindow
  ])

  const onBack = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [navigate])

  const addTransaction = useCallback(
    (executionType: 'queue' | 'open') => {
      if (isFormValid && state.selectedToken) {
        if (executionType === 'queue' && !transferCtrl.shouldSkipTransactionQueuedModal) {
          openBottomSheet()
        }

        dispatch({
          type: 'MAIN_CONTROLLER_BUILD_TRANSFER_USER_REQUEST',
          params: {
            amount: state.amount,
            selectedToken: state.selectedToken,
            recipientAddress: isTopUp ? FEE_COLLECTOR : getAddressFromAddressState(addressState),
            executionType
          }
        })

        transferCtrl.resetForm()
        return
      }

      if (executionType === 'open' && transactionUserRequests.length && isFormEmpty) {
        const firstAccountOpAction = actionsState.visibleActionsQueue
          .reverse()
          .find((a) => a.type === 'accountOp')
        if (!firstAccountOpAction) {
          const entryPointAction = actionsState.visibleActionsQueue.find(
            (a) => a.id.toString() === ENTRY_POINT_AUTHORIZATION_REQUEST_ID
          )
          if (entryPointAction) {
            dispatch({
              type: 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID',
              params: { actionId: ENTRY_POINT_AUTHORIZATION_REQUEST_ID }
            })
          }
          return
        }
        dispatch({
          type: 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID',
          params: { actionId: firstAccountOpAction?.id }
        })
      }
    },
    [
      transferCtrl,
      addressState,
      isTopUp,
      state.amount,
      state.selectedToken,
      isFormEmpty,
      transactionUserRequests.length,
      actionsState,
      isFormValid,
      dispatch,
      openBottomSheet
    ]
  )

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="xl"
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <>
          <BackButton onPress={onBack} />
          <View
            style={[flexbox.directionRow, !isSmartAccount && flexbox.flex1, flexbox.justifyEnd]}
          >
            {!!isSmartAccount && (
              <Button
                testID="transfer-queue-and-add-more-button"
                type="outline"
                accentColor={theme.primary}
                text={t('Queue and Add More')}
                onPress={() => addTransaction('queue')}
                disabled={
                  !isFormValid || (!isTopUp && addressInputState.validation.isError) || isOffline
                }
                hasBottomSpacing={false}
                style={spacings.mr}
                size="large"
              >
                <View style={[spacings.plSm, flexbox.directionRow, flexbox.alignCenter]}>
                  <CartIcon color={theme.primary} />
                  {!!transactionUserRequests.length && !hasOpenedActionWindow && (
                    <Text
                      fontSize={16}
                      weight="medium"
                      color={theme.primary}
                    >{` (${transactionUserRequests.length})`}</Text>
                  )}
                </View>
              </Button>
            )}
            <Button
              testID="transfer-button-confirm"
              type="primary"
              text={submitButtonText}
              onPress={() => addTransaction('open')}
              hasBottomSpacing={false}
              size="large"
              disabled={isSendButtonDisabled}
            >
              {!isOffline && (
                <View style={spacings.plTy}>
                  {isTopUp ? (
                    <TopUpIcon
                      strokeWidth={1}
                      width={24}
                      height={24}
                      color={theme.primaryBackground}
                    />
                  ) : (
                    <SendIcon width={24} height={24} color={theme.primaryBackground} />
                  )}
                </View>
              )}
            </Button>
          </View>
        </>
      }
    >
      <TabLayoutWrapperMainContent contentContainerStyle={spacings.pt2Xl}>
        {state?.isInitialized ? (
          <Panel
            style={[styles.panel]}
            forceContainerSmallSpacings
            title={state.isTopUp ? 'Top Up Gas Tank' : 'Send'}
          >
            <SendForm
              addressInputState={addressInputState}
              isSmartAccount={isSmartAccount}
              amountErrorMessage={validationFormMsgs.amount.message || ''}
              isRecipientAddressUnknown={isRecipientAddressUnknown}
              isRecipientHumanizerKnownTokenOrSmartContract={
                isRecipientHumanizerKnownTokenOrSmartContract
              }
              isSWWarningVisible={isSWWarningVisible}
            />
            {isTopUp && !isSmartAccount && (
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
            {isTopUp && isSmartAccount && (
              <View style={spacings.ptSm}>
                <Alert
                  type="warning"
                  title={<Trans>Gas Tank deposits cannot be withdrawn.</Trans>}
                  isTypeLabelHidden
                />
              </View>
            )}
          </Panel>
        ) : (
          <SkeletonLoader
            width={640}
            height={420}
            appearance="primaryBackground"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        )}
      </TabLayoutWrapperMainContent>
      <BottomSheet
        id="import-seed-phrase"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        backgroundColor="secondaryBackground"
        style={{ overflow: 'hidden', width: 496, ...spacings.ph0, ...spacings.pv0 }}
        type="modal"
      >
        <DualChoiceModal
          title={t('Transaction queued')}
          description={
            <View>
              <Text style={spacings.mbTy} appearance="secondaryText">
                {t(
                  'You can now add more transactions on this network and send them batched all together for signing.'
                )}
              </Text>
              <Text appearance="secondaryText" style={spacings.mbLg}>
                {t('The queued pending transactions are available on your Dashboard.')}
              </Text>
              <Checkbox
                value={transferCtrl.shouldSkipTransactionQueuedModal}
                onValueChange={() => {
                  transferCtrl.shouldSkipTransactionQueuedModal =
                    !transferCtrl.shouldSkipTransactionQueuedModal
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
          onPrimaryButtonPress={closeBottomSheet}
          primaryButtonText={t('Got it')}
          primaryButtonTestID="queue-modal-got-it-button"
        />
      </BottomSheet>
    </TabLayoutContainer>
  )
}

export default React.memo(TransferScreen)
