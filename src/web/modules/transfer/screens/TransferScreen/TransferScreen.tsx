import React, { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import humanizerInfo from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { AddressStateOptional } from '@ambire-common/interfaces/domains'
import { isSmartAccount as getIsSmartAccount } from '@ambire-common/libs/account/account'
import SendIcon from '@common/assets/svg/SendIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useAddressInput from '@common/hooks/useAddressInput'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import useTransferControllerState from '@web/hooks/useTransferControllerState'
import SendForm from '@web/modules/transfer/components/SendForm/SendForm'
import useUpdateTransferControllerState from '@web/modules/transfer/hooks/useUpdateTransferControllerState'
import useUpdateTransferLocalState from '@web/modules/transfer/hooks/useUpdateTransferLocalState'
import getSendFormValidation, {
  getIsFormDisabled
} from '@web/modules/transfer/utils/validateSendForm'

import getStyles from './styles'

const TransferScreen = () => {
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { state } = useTransferControllerState()
  const { isTopUp, userRequest } = state
  const { accountPortfolio } = usePortfolioControllerState()
  const { networks } = useSettingsControllerState()
  const { contacts } = useAddressBookControllerState()
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { selectedAccount, accounts } = useMainControllerState()
  const selectedAccountData = accounts.find((account) => account.addr === selectedAccount)
  const isSmartAccount = selectedAccountData ? getIsSmartAccount(selectedAccountData) : false

  // If state isn't duplicated on the front-end input fields become extremely unresponsive,
  // especially for accounts with more assets. The work around is:
  // 1. Set local state to controller state on initialization
  // 2. Make subsequent updates to the local state on tab focus
  // 3. Update controller state based on local state (debounced, every x ms)
  const [localAmount, setLocalAmount] = useState(state.amount || '')
  const [localAddressState, setLocalAddressState] = useState(
    state.addressState || {
      fieldValue: '',
      ensAddress: '',
      udAddress: '',
      isDomainResolving: false
    }
  )
  // Local state < --- Controller state on initialization and tab focus
  const { isUpdatingLocalState } = useUpdateTransferLocalState({
    isInitialized: state.isInitialized,
    setLocalAmount,
    setLocalAddressState,
    amount: state.amount,
    addressState: state.addressState
  })

  const {
    validationFormMsgs,
    isRecipientAddressUnknown,
    isSWWarningVisible,
    isRecipientHumanizerKnownTokenOrSmartContract
  } = getSendFormValidation({
    addressState: localAddressState,
    selectedAccount,
    amount: localAmount,
    selectedToken: state.selectedToken,
    isRecipientAddressUnknownAgreed: state.isRecipientAddressUnknownAgreed,
    isSWWarningAgreed: state.isSWWarningAgreed,
    networks,
    contacts,
    isTopUp,
    humanizerInfo
  })

  const setLocalAddressStateWrapped = useCallback((newAddressState: AddressStateOptional) => {
    setLocalAddressState((prevState) => ({
      ...prevState,
      ...newAddressState
    }))
  }, [])

  const addressInputState = useAddressInput({
    addressState: localAddressState,
    setAddressState: setLocalAddressStateWrapped,
    overwriteError:
      state?.isInitialized && !validationFormMsgs.recipientAddress.success
        ? validationFormMsgs.recipientAddress.message
        : '',
    overwriteValidLabel: validationFormMsgs?.recipientAddress.success
      ? validationFormMsgs.recipientAddress.message
      : ''
  })

  const onBack = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_RESET_FORM'
    })
    navigate(ROUTES.dashboard)
  }, [navigate, dispatch])

  const sendTransaction = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_BUILD_USER_REQUEST'
    })
    // @TODO - Replace with withStatus
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_RESET_FORM'
    })
    setLocalAmount('')
    setLocalAddressState({
      fieldValue: '',
      ensAddress: '',
      udAddress: '',
      isDomainResolving: false
    })
    // @TODO - End of Replace with withStatus
  }, [dispatch])

  // Local state --- > Controller state updates on state change
  useUpdateTransferControllerState({
    isUpdatingLocalState,
    state: localAmount,
    key: 'amount'
  })

  useUpdateTransferControllerState({
    isUpdatingLocalState,
    state: localAddressState,
    key: 'addressState'
  })

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="xl"
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <>
          <BackButton onPress={onBack} />
          <Button
            testID="transfer-button-send"
            type="primary"
            text={
              userRequest
                ? t(!isTopUp ? 'Sending...' : 'Topping up...')
                : t(!isTopUp ? 'Send' : 'Top Up')
            }
            onPress={sendTransaction}
            hasBottomSpacing={false}
            size="large"
            disabled={getIsFormDisabled({
              userRequest,
              isTopUp,
              isAmountValid: validationFormMsgs.amount.success,
              isAddressValid:
                !addressInputState.validation.isError && !localAddressState.isDomainResolving,
              isSmartAccount
            })}
          >
            <View style={spacings.plTy}>
              {isTopUp ? (
                <TopUpIcon strokeWidth={1} width={24} height={24} color={theme.primaryBackground} />
              ) : (
                <SendIcon width={24} height={24} color={theme.primaryBackground} />
              )}
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        {state?.isInitialized ? (
          <Panel
            style={[styles.panel]}
            forceContainerSmallSpacings
            title={state.isTopUp ? 'Top Up Gas Tank' : 'Send'}
          >
            <SendForm
              isUpdatingLocalState={isUpdatingLocalState}
              addressInputState={addressInputState}
              localAmount={localAmount}
              localAddressState={localAddressState}
              setLocalAmount={setLocalAmount}
              setLocalAddressState={setLocalAddressState}
              state={state}
              isAllReady={accountPortfolio?.isAllReady}
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
          </Panel>
        ) : (
          <View style={styles.spinnerContainer}>
            <Spinner />
          </View>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(TransferScreen)
