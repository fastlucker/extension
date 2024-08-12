/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import { DappRequestAction } from '@ambire-common/controllers/actions/actions'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import ActionFooter from '@web/modules/action-requests/components/ActionFooter'

import DAppConnectBody from './components/DAppConnectBody'
import DAppConnectHeader from './components/DAppConnectHeader'
import getStyles from './styles'

// Screen for dApps authorization to connect to extension - will be triggered on dApp connect request
const DappConnectScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const state = useActionsControllerState()
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const dappAction = useMemo(() => {
    if (state.currentAction?.type !== 'dappRequest') return undefined

    return state.currentAction as DappRequestAction
  }, [state.currentAction])

  const userRequest = useMemo(() => {
    if (!dappAction) return undefined
    if (dappAction.userRequest.action.kind !== 'dappConnect') return undefined

    return dappAction.userRequest
  }, [dappAction])

  const handleDenyButtonPress = useCallback(() => {
    if (!dappAction) return

    dispatch({
      type: 'MAIN_CONTROLLER_REJECT_USER_REQUEST',
      params: { err: t('User rejected the request.'), id: dappAction.id }
    })
  }, [dappAction, t, dispatch])

  const handleAuthorizeButtonPress = useCallback(() => {
    if (!dappAction) return

    setIsAuthorizing(true)
    dispatch({
      type: 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST',
      params: { data: null, id: dappAction.id }
    })
  }, [dappAction, dispatch])

  return (
    <TabLayoutContainer
      width="full"
      backgroundColor={theme.secondaryBackground}
      footer={
        <ActionFooter
          onReject={handleDenyButtonPress}
          onResolve={handleAuthorizeButtonPress}
          resolveButtonText={isAuthorizing ? t('Connecting...') : t('Connect')}
          resolveDisabled={isAuthorizing}
          resolveButtonTestID="dapp-connect-button"
        />
      }
    >
      <View style={styles.container}>
        <AmbireLogoHorizontal style={spacings.mbLg} />
        <View style={styles.content}>
          <DAppConnectHeader
            name={userRequest?.session?.name}
            origin={userRequest?.session?.origin}
            icon={userRequest?.session?.icon}
          />
          <DAppConnectBody />
        </View>
      </View>
    </TabLayoutContainer>
  )
}

export default React.memo(DappConnectScreen)
