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
import usePrevious from '@common/hooks/usePrevious'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
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
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { currentDappNotificationRequest } = useNotificationControllerState()

  const prevSignMessageState: SignMessageController =
    usePrevious(signMessageState) || ({} as SignMessageController)

  // TODO: Remove these when ready
  console.log('signMessageState: ', signMessageState)
  console.log('mainState', mainState)

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
    const msgsToBeSigned = mainState.messagesToBeSigned[mainState.selectedAccount || '']
    if (msgsToBeSigned.length) {
      if (msgsToBeSigned[0].id !== signMessageState.messageToSign?.id) {
        dispatch({
          type: 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT',
          params: {
            messageToSign: mainState.messagesToBeSigned[mainState.selectedAccount || ''][0]
          }
        })
      }
    }
  }, [
    dispatch,
    mainState.messagesToBeSigned,
    mainState.selectedAccount,
    signMessageState.messageToSign?.id
  ])

  useEffect(() => {
    if (!getUiType().isNotification) return
    const reset = () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
    }
    window.addEventListener('beforeunload', reset)

    return () => {
      window.removeEventListener('beforeunload', reset)
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
    }
  }, [dispatch])

  const keySelectorValues = useMemo(() => {
    return (
      mainState.accounts
        .find((acc) => acc.addr === mainState.selectedAccount)
        ?.associatedKeys?.map((assocKey: string) => ({ value: assocKey, label: assocKey })) || []
    )
  }, [mainState.accounts, mainState.selectedAccount])

  const handleChangeSigningKey = (signKey: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY',
      params: { key: signKey }
    })
  }

  useEffect(() => {
    if (keySelectorValues.length) {
      handleChangeSigningKey(keySelectorValues[0].value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySelectorValues.length])

  const keyValue = useMemo(() => {
    return {
      value: signMessageState.signingKeyAddr,
      label: signMessageState.signingKeyAddr
    }
  }, [signMessageState.signingKeyAddr])

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

  return (
    <Wrapper hasBottomTabNav={false}>
      <Trans values={{ name: currentDappNotificationRequest?.params?.session?.name || 'The dApp' }}>
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
        setValue={(newValue: any) => handleChangeSigningKey(newValue.value)}
        label={t('Signing with account')}
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
