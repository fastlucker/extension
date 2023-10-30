import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import networks from '@common/constants/networks'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import MessageSummary from '@web/modules/sign-message/controllers/MessageSummary'
import { getUiType } from '@web/utils/uiType'

import FallbackVisualization from './FallbackVisualization'
import Header from './Header/Header'
import Info from './Info'
import styles from './styles'

const SignMessageScreen = () => {
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const keystoreState = useKeystoreControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { params } = useRoute()
  const { navigate } = useNavigation()
  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)
  const networkData =
    networks.find(({ id }) => signMessageState.messageToSign?.networkId === id) || null

  const prevSignMessageState: SignMessageController =
    usePrevious(signMessageState) || ({} as SignMessageController)

  const selectedAccountFull = mainState.accounts.find(
    (acc) => acc.addr === mainState.selectedAccount
  )

  const selectedAccountKeyStoreKeys = keystoreState.keys.filter((key) =>
    selectedAccountFull?.associatedKeys.includes(key.addr)
  )

  const isScrollToBottomForced =
    signMessageState.messageToSign?.content.kind === 'typedMessage' && !hasReachedBottom

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
    mainState.messagesToBeSigned,
    mainState.selectedAccount,
    mainState.accounts,
    mainState.accountStates,
    signMessageState.messageToSign?.id,
    signMessageState.messageToSign?.accountAddr
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

  const network = useMemo(
    () =>
      mainState.settings.networks.find((n) => n.id === signMessageState.messageToSign?.networkId),
    [mainState.settings.networks, signMessageState.messageToSign?.networkId]
  )

  const onSignButtonClick = () => {
    // If the account has only one signer, we don't need to show the select signer overlay
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
    <View style={styles.container}>
      <Header
        networkId={networkData?.id}
        networkName={networkData?.name}
        selectedAccountAddr={selectedAccountFull?.addr}
      />
      <View style={styles.content}>
        <Text weight="medium" fontSize={20} style={styles.title}>
          {t('Sign message')}
        </Text>
        <Info kindOfMessage={signMessageState.messageToSign?.content.kind} />
        {signMessageState.humanReadable &&
        network &&
        signMessageState.messageToSign?.content.kind ? (
          <MessageSummary
            message={signMessageState.humanReadable}
            networkId={network?.id}
            explorerUrl={network?.explorerUrl}
            kind={signMessageState.messageToSign?.content.kind}
            setHasReachedBottom={setHasReachedBottom}
          />
        ) : (
          <FallbackVisualization
            setHasReachedBottom={setHasReachedBottom}
            messageToSign={signMessageState.messageToSign}
          />
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <Button text="Reject" type="danger" style={styles.rejectButton} onPress={handleReject} />

        {isScrollToBottomForced ? (
          <Text appearance="errorText">{t('Please read the message before signing.')}</Text>
        ) : null}

        {/* 
          zIndex is 0 by default. We need to set it to 'unset' to make sure the shadow isn't visible
          when we show the select signer overlay
        */}
        {/* @ts-ignore  */}
        <View style={styles.signButtonContainer}>
          {isChooseSignerShown ? (
            <SigningKeySelect
              selectedAccountKeyStoreKeys={selectedAccountKeyStoreKeys}
              handleChangeSigningKey={handleChangeSigningKey}
            />
          ) : null}
          <Button
            text={signMessageState.status === 'LOADING' ? t('Signing...') : t('Sign')}
            disabled={signMessageState.status === 'LOADING' || !hasReachedBottom}
            type="primary"
            style={styles.signButton}
            onPress={onSignButtonClick}
          />
        </View>
      </View>
      {isChooseSignerShown ? (
        <Pressable onPress={() => setIsChooseSignerShown(false)} style={styles.overlay} />
      ) : null}
    </View>
  )
}

export default React.memo(SignMessageScreen)
