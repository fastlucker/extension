import React, { useEffect } from 'react'

import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import { getUiType } from '@web/utils/uiType'

const SignMessageScreen = () => {
  const signMessageState = useSignMessageControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  console.log('signMessageState: ', signMessageState)
  console.log('mainState', mainState)

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

  return (
    <Wrapper hasBottomTabNav={false} contentContainerStyle={spacings.pt0}>
      <Text style={text.center} fontSize={100}>
        Sign Message Screen
      </Text>
    </Wrapper>
  )
}

export default React.memo(SignMessageScreen)
