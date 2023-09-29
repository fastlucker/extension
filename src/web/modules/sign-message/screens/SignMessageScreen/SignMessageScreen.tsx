import { SignMessageController } from 'ambire-common/src/controllers/signMessage/signMessage'
import { toUtf8String } from 'ethers'
import React, { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'

import Button from '@common/components/Button'
import Select from '@common/components/Select'
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
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

function getMessageAsText(msg: any) {
  try {
    return toUtf8String(msg)
  } catch (_) {
    return msg
  }
}

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

  const keySelectorValues = useMemo(() => {
    // Pull keys from the Keystore and match the ones that have the
    // same address as the associatedKeys for the selected account.
    return keystoreState.keys
      .filter((key) =>
        mainState.accounts
          .find((acc) => acc.addr === mainState.selectedAccount)
          ?.associatedKeys.includes(key.addr)
      )
      .map((key) => ({
        value: `${key.addr}|${key.type}`,
        label: `${key.label} (${key.addr})`
      }))
  }, [keystoreState.keys, mainState.accounts, mainState.selectedAccount])

  const handleChangeSigningKey = (keyAddr: string, keyType: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY',
      params: { key: keyAddr, type: keyType }
    })
  }

  useEffect(() => {
    if (keySelectorValues.length) {
      const [keyAddr, keyType] = keySelectorValues[0].value.split('|')
      handleChangeSigningKey(keyAddr, keyType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySelectorValues.length])

  const keyValue = useMemo(() => {
    const key = keystoreState.keys.find(
      (x) =>
        x.addr === signMessageState.signingKeyAddr && x.type === signMessageState.signingKeyType
    )
    return {
      value: `${signMessageState.signingKeyAddr}|${signMessageState.signingKeyType}`,
      label: key ? `${key.label} (${key.addr})` : 'Key'
    }
  }, [keystoreState.keys, signMessageState])

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

  const selectedAccountDetails = mainState.accounts.find(
    (acc) => acc.addr === mainState.selectedAccount
  )

  return (
    <Wrapper hasBottomTabNav={false}>
      <Trans values={{ name: currentNotificationRequest?.params?.session?.name || 'The dApp' }}>
        <Text style={spacings.mb}>
          <Text weight="semiBold">{'{{name}} '}</Text>
          <Text>is requesting your signature.</Text>
        </Text>
      </Trans>

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
      <Select
        setValue={(newValue: any) => {
          const [keyAddr, keyType] = newValue.value.split('|')
          handleChangeSigningKey(keyAddr, keyType)
        }}
        label={
          selectedAccountDetails?.label
            ? t('Signing with account {{accountLabel}} ({{accountAddress}}) via key:', {
                accountLabel: selectedAccountDetails?.label,
                accountAddress: mainState.selectedAccount
              })
            : t('Signing with account {{accountAddress}} via key:', {
                accountAddress: mainState.selectedAccount
              })
        }
        options={keySelectorValues}
        disabled={!keySelectorValues.length}
        style={spacings.mb}
        value={keyValue as {}}
        defaultValue={keyValue as {}}
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
