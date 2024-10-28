import React, { useMemo } from 'react'
import { Pressable, View } from 'react-native'

import { DappRequestAction } from '@ambire-common/controllers/actions/actions'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

const SwitchAccountRequest = () => {
  const { dispatch } = useBackgroundService()
  const { currentAction } = useActionsControllerState()

  const dappAction = useMemo(() => {
    if (currentAction?.type !== 'switchAccount') return undefined
    return currentAction
  }, [currentAction])

  const userRequest = useMemo(() => {
    if (!dappAction) return undefined
    if (dappAction.type !== 'switchAccount') return undefined

    return dappAction.userRequest
  }, [dappAction])

  const selectAccount = () => {
    // @ts-ignore
    console.log(currentAction)

    if (!userRequest) return

    dispatch({
      type: 'MAIN_CONTROLLER_RESOLVE_SWITCH_ACCOUNT_REQUEST',
      params: { actionId: dappAction.id }
    })
  }
  return (
    <View>
      <Pressable onPress={selectAccount}>Switch Acc</Pressable>
    </View>
  )
}

export default SwitchAccountRequest
