import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import MessageSummary from '@web/modules/sign-message/controllers/MessageSummary'
import { getUiType } from '@web/utils/uiType'

import FallbackVisualization from './FallbackVisualization'
import Header from './Header/Header'
import Info from './Info'
import styles from './styles'

const SignMessageScreen = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const keystoreState = useKeystoreControllerState()
  const mainState = useMainControllerState()
  const { networks } = useSettingsControllerState()
  const { dispatch } = useBackgroundService()
  const { params } = useRoute()
  const { navigate } = useNavigation()
  const { currentNotificationRequest } = useNotificationControllerState()

  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)
  const networkData =
    networks.find(({ id }) => signMessageState.messageToSign?.networkId === id) || null

  const prevSignMessageState: SignMessageController =
    usePrevious(signMessageState) || ({} as SignMessageController)

  const selectedAccountFull = useMemo(
    () => mainState.accounts.find((acc) => acc.addr === mainState.selectedAccount),
    [mainState.accounts, mainState.selectedAccount]
  )

  const selectedAccountKeyStoreKeys = useMemo(
    () =>
      keystoreState.keys.filter((key) => selectedAccountFull?.associatedKeys.includes(key.addr)),
    [keystoreState.keys, selectedAccountFull?.associatedKeys]
  )

  const network = useMemo(
    () => networks.find((n) => n.id === signMessageState.messageToSign?.networkId),
    [networks, signMessageState.messageToSign?.networkId]
  )

  const isViewOnly = useMemo(
    () => selectedAccountKeyStoreKeys.length === 0,
    [selectedAccountKeyStoreKeys.length]
  )

  const visualizeHumanized = useMemo(
    () =>
      signMessageState.humanReadable !== null &&
      network &&
      signMessageState.messageToSign?.content.kind,
    [network, signMessageState.humanReadable, signMessageState.messageToSign?.content?.kind]
  )

  const isScrollToBottomForced = useMemo(
    () =>
      signMessageState.messageToSign?.content.kind === 'typedMessage' &&
      !hasReachedBottom &&
      !visualizeHumanized,
    [hasReachedBottom, signMessageState.messageToSign?.content?.kind, visualizeHumanized]
  )

  useEffect(() => {
    if (!params?.accountAddr) {
      navigate('/')
    }
  }, [params?.accountAddr, navigate])

  useEffect(() => {
    if (prevSignMessageState.status === 'LOADING' && signMessageState.status === 'DONE') {
      if (signMessageState.signedMessage) {
        dispatch({
          type: 'MAIN_CONTROLLER_BROADCAST_SIGNED_MESSAGE',
          params: { signedMessage: signMessageState.signedMessage }
        })
      }
    }
  }, [
    dispatch,
    prevSignMessageState.status,
    signMessageState.signedMessage,
    signMessageState.status
  ])

  useEffect(() => {
    const msgsToBeSigned = mainState.messagesToBeSigned[params!.accountAddr] || []
    if (msgsToBeSigned.length) {
      if (msgsToBeSigned[0].id !== signMessageState.messageToSign?.id) {
        dispatch({
          type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
          params: {
            filters: {
              account:
                (signMessageState.messageToSign?.accountAddr as string) ||
                (params!.accountAddr as string),
              network: networks[0].id
            }
          }
        })

        const msgsToSign =
          mainState.messagesToBeSigned[params!.accountAddr || mainState.selectedAccount || '']
        // Last message that was pushed to the messagesToBeSigned
        const msgToSign = msgsToSign[msgsToSign.length - 1]
        dispatch({
          type: 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT',
          params: {
            dapp: {
              name: currentNotificationRequest?.params?.session?.name,
              icon: currentNotificationRequest?.params?.session?.icon
            },
            messageToSign: msgToSign,
            accounts: mainState.accounts,
            accountStates: mainState.accountStates
          }
        })
      }
    }
  }, [
    dispatch,
    params,
    networks,
    mainState.messagesToBeSigned,
    mainState.selectedAccount,
    mainState.accounts,
    mainState.accountStates,
    signMessageState.messageToSign?.id,
    signMessageState.messageToSign?.accountAddr,
    currentNotificationRequest?.params
  ])

  useEffect(() => {
    if (!getUiType().isNotification) return
    const reset = () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET' })
    }
    window.addEventListener('beforeunload', reset)

    return () => {
      window.removeEventListener('beforeunload', reset)
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET' })
    }
  }, [dispatch])

  const handleChangeSigningKey = useCallback(
    (keyAddr: string, keyType: string) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY',
        params: { key: keyAddr, type: keyType }
      })
    },
    [dispatch]
  )

  const handleReject = () => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }

  const handleSign = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SIGN'
    })
  }, [dispatch])

  useEffect(() => {
    if (
      signMessageState.isInitialized &&
      signMessageState.status === 'INITIAL' &&
      signMessageState.signingKeyAddr &&
      signMessageState.signingKeyType &&
      signMessageState.messageToSign
    ) {
      handleSign()
    }
  }, [
    handleSign,
    signMessageState.isInitialized,
    signMessageState.status,
    signMessageState.signingKeyAddr,
    signMessageState.signingKeyType,
    signMessageState.messageToSign
  ])

  if (!Object.keys(signMessageState).length) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.center]}>
        <Spinner />
      </View>
    )
  }

  const onSignButtonClick = () => {
    // FIXME: Ugly workaround for triggering `handleSign` manually.
    // This approach is a temporary fix to address the issue where the
    // 'useEffect' hook fails to get re-triggered. The original 'useEffect' was
    // supposed to trigger 'handleSign' when certain conditions in
    // 'signMessageState' were met. However, we encountered a problem: when
    // 'mainCtrl.signMessage.sign()' throws an error (e.g., hardware wallet issues),
    // the 'Sign' button becomes non-responsive. This happens because the
    // 'useEffect' doesn't reactivate after the first  execution of
    // 'mainCtrl.signMessage.setSigningKey'. To ensure functionality, this
    // workaround checks if the signing key is set (via 'hasSigningKey') and
    // then directly calls 'handleSign', bypassing the problematic 'useEffect' logic.
    // A more robust and maintainable fix should be explored
    // to handle such edge cases effectively in the future!
    // FIXME: this won't allow changing the signing key (if user has multiple)
    // after the first time the user picks key and attempts to sign the message
    // (which ultimately sets the signing key the first time it gets triggered).
    const hasSigningKey = signMessageState.signingKeyAddr && signMessageState.signingKeyType
    if (hasSigningKey) return handleSign()

    // If the account has only one signer, we don't need to show the keys select
    if (selectedAccountKeyStoreKeys.length === 1) {
      handleChangeSigningKey(
        selectedAccountKeyStoreKeys[0].addr,
        selectedAccountKeyStoreKeys[0].type
      )
      return
    }

    setIsChooseSignerShown(true)
  }

  return (
    <TabLayoutContainer
      header={<Header networkId={networkData?.id} networkName={networkData?.name} />}
      footer={
        <View style={styles.buttonsContainer}>
          <Button
            text="Reject"
            type="danger"
            style={styles.rejectButton}
            textStyle={styles.rejectButtonText}
            onPress={handleReject}
          >
            <CloseIcon color={theme.errorDecorative} />
          </Button>

          {isScrollToBottomForced && !isViewOnly ? (
            <Text appearance="errorText" weight="medium">
              {t('Please read the message before signing.')}
            </Text>
          ) : null}
          {isViewOnly ? (
            <Text appearance="errorText" weight="medium">
              {t("You can't sign messages with view-only accounts.")}
            </Text>
          ) : null}
          <View style={styles.signButtonContainer}>
            {isChooseSignerShown ? (
              <SigningKeySelect
                selectedAccountKeyStoreKeys={selectedAccountKeyStoreKeys}
                handleChangeSigningKey={handleChangeSigningKey}
              />
            ) : null}
            <Button
              text={signMessageState.status === 'LOADING' ? t('Signing...') : t('Sign')}
              disabled={
                signMessageState.status === 'LOADING' || isScrollToBottomForced || isViewOnly
              }
              type="primary"
              style={styles.signButton}
              onPress={onSignButtonClick}
            />
          </View>
        </View>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg} contentContainerStyle={spacings.pvXl}>
        <View style={flexbox.flex1}>
          <Text weight="medium" fontSize={20}>
            {t('Sign message')}
          </Text>
          <Info kindOfMessage={signMessageState.messageToSign?.content.kind} />
          {visualizeHumanized &&
          // @TODO: Duplicate check. For some reason ts throws an error if we don't do this
          signMessageState.humanReadable &&
          signMessageState.messageToSign?.content.kind ? (
            <MessageSummary
              message={signMessageState.humanReadable}
              networkId={network?.id}
              explorerUrl={network?.explorerUrl}
              kind={signMessageState.messageToSign?.content.kind}
            />
          ) : (
            <FallbackVisualization
              setHasReachedBottom={setHasReachedBottom}
              messageToSign={signMessageState.messageToSign}
            />
          )}
          {isChooseSignerShown ? (
            <Pressable onPress={() => setIsChooseSignerShown(false)} style={styles.overlay} />
          ) : null}
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SignMessageScreen)
