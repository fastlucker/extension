import { SignMessageController } from 'ambire-common/src/controllers/signMessage/signMessage'
import { Account } from 'ambire-common/src/interfaces/account'
import { IrMessage } from 'ambire-common/src/libs/humanizer/interfaces'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'

import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import networks from '@common/constants/networks'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import MessageSummary from '@web/modules/sign-message/controllers/MessageSummary'
import { getMessageAsText } from '@web/modules/sign-message/utils'
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

const SignMessageScreen = () => {
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const keystoreState = useKeystoreControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { currentNotificationRequest } = useNotificationControllerState()
  const { params } = useRoute()
  const { navigate } = useNavigation()

  const prevSignMessageState: SignMessageController =
    usePrevious(signMessageState) || ({} as SignMessageController)

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

  const selectedAccountFull = mainState.accounts.find(
    (acc) => acc.addr === mainState.selectedAccount
  )

  const handleChangeSigningKey = useCallback(
    (keyAddr: string, keyType: string) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY',
        params: { key: keyAddr, type: keyType }
      })
    },
    [dispatch]
  )

  // Set the first key as the selected key
  useEffect(() => {
    const firstKey = keystoreState.keys.find((key) =>
      selectedAccountFull?.associatedKeys.includes(key.addr)
    )

    if (firstKey) {
      handleChangeSigningKey(firstKey?.addr, firstKey?.type)
    }
  }, [handleChangeSigningKey, keystoreState.keys, selectedAccountFull?.associatedKeys])

  const handleReject = () => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }

  const handleSign = () => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SIGN'
    })
  }

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

  const humanizedVisualization = useCallback(
    (message: IrMessage) => {
      return (
        <MessageSummary
          message={message}
          networkId={network?.id}
          explorerUrl={network?.explorerUrl}
          kind={signMessageState.messageToSign?.content.kind}
        />
      )
    },
    [network?.explorerUrl, network?.id, signMessageState.messageToSign?.content.kind]
  )

  const fallbackVisualization = useCallback(() => {
    return (
      <>
        {signMessageState.messageToSign?.content.kind === 'typedMessage' && (
          <>
            <Text style={spacings.mbMi}>
              {t('A typed data signature (EIP-712) has been requested. Message:')}
            </Text>
            <TextInput
              value={JSON.stringify(
                {
                  domain: signMessageState.messageToSign?.content.domain,
                  types: signMessageState.messageToSign?.content.types,
                  message: signMessageState.messageToSign?.content.message
                },
                null,
                4
              )}
              multiline
              numberOfLines={16}
              editable={false}
              style={[styles.textarea, spacings.mb]}
            />
          </>
        )}
        {signMessageState.messageToSign?.content.kind === 'message' && (
          <>
            <Text>{t('A standard signature (ethSign) has been requested. Message:')}</Text>
            <View style={spacings.pv}>
              <Text weight="semiBold">
                {getMessageAsText(signMessageState.messageToSign?.content.message) ||
                  t('(Empty message)')}
              </Text>
            </View>
          </>
        )}
      </>
    )
  }, [signMessageState.messageToSign?.content, t])

  return (
    <Wrapper hasBottomTabNav={false}>
      <Trans values={{ name: currentNotificationRequest?.params?.session?.name || 'The dApp' }}>
        <Text style={spacings.mb}>
          <Text weight="semiBold">{'{{name}} '}</Text>
          <Text>is requesting your signature.</Text>
        </Text>
      </Trans>
      {signMessageState.humanReadable
        ? humanizedVisualization(signMessageState.humanReadable)
        : fallbackVisualization()}
      <SigningKeySelect
        keystoreKeys={keystoreState.keys}
        selectedKeyAddr={signMessageState.signingKeyAddr}
        selectedKeyType={signMessageState.signingKeyType}
        selectedAccountFull={selectedAccountFull as Account} // should always exist
        handleChangeSigningKey={handleChangeSigningKey}
      />
      <View style={flexbox.directionRow}>
        <Button
          text="Reject"
          type="danger"
          style={{ width: 230, height: 66, marginRight: 20 }}
          onPress={handleReject}
        />
        <Button
          text="Sign"
          type="primary"
          style={{ width: 230, height: 66 }}
          onPress={handleSign}
        />
      </View>
    </Wrapper>
  )
}

export default React.memo(SignMessageScreen)
