import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { ActiveRoute, SocketAPIBridgeUserTx } from '@ambire-common/interfaces/swapAndBridge'
import { getQuoteRouteSteps } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button, { ButtonProps } from '@common/components/Button'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatTime from '@common/utils/formatTime'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import RouteStepsPreview from '@web/modules/swap-and-bridge/components/RouteStepsPreview'

import getStyles from './styles'

const ActiveRouteCard = ({ activeRoute }: { activeRoute: ActiveRoute }) => {
  const { styles, theme } = useTheme(getStyles)
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { statuses } = useMainControllerState()

  const activeTransaction = useMemo(() => {
    if (!activeRoute.route) return

    return activeRoute.route.userTxs[activeRoute.route.currentUserTxIndex]
  }, [activeRoute.route])

  const steps = useMemo(() => {
    // TODO: Migrate Socket to SwapAndBridgeStep
    // return getQuoteRouteSteps(activeRoute.route.userTxs)
    return activeRoute.route.steps
  }, [activeRoute.route.steps])

  const handleRejectActiveRoute = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_REMOVE_ACTIVE_ROUTE',
      params: { activeRouteId: activeRoute.activeRouteId }
    })
  }, [activeRoute.activeRouteId, dispatch])

  const handleProceedToNextStep = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_ACTIVE_ROUTE_BUILD_NEXT_USER_REQUEST',
      params: { activeRouteId: activeRoute.activeRouteId }
    })
  }, [activeRoute.activeRouteId, dispatch])

  const rejectBtn = useMemo<{ text: string; type: ButtonProps['type'] }>(() => {
    const isLastTxn = activeRoute.route.totalUserTx === activeRoute.route.currentUserTxIndex + 1

    // If the transaction is in the middle of the process, you can cancel the next step
    const isInTheMiddle = !isLastTxn && activeRoute.routeStatus === 'in-progress'
    if (isInTheMiddle) return { text: t('Cancel Next Step'), type: 'danger' }

    // You can't really cancel ongoing txn, only closing it (it might got stuck)
    if (
      activeRoute.routeStatus === 'in-progress' ||
      activeRoute.routeStatus === 'waiting-approval-to-resolve'
    )
      return { text: t('Close'), type: 'ghost' }

    // In all other scenarios, you can cancel the process
    return { text: t('Cancel'), type: 'danger' }
  }, [
    activeRoute.route.currentUserTxIndex,
    activeRoute.routeStatus,
    activeRoute.route.totalUserTx,
    t
  ])

  const proceedBtnText = useMemo(() => {
    if (statuses.buildSwapAndBridgeUserRequest !== 'INITIAL') return t('Building Transaction...')

    const isFirstTxn = activeRoute.route.currentUserTxIndex === 0
    if (
      isFirstTxn &&
      activeRoute.routeStatus !== 'in-progress' &&
      activeRoute.routeStatus !== 'waiting-approval-to-resolve'
    )
      return t('Proceed')

    const isLastTxn = activeRoute.route.totalUserTx === activeRoute.route.currentUserTxIndex + 1
    if (isLastTxn && activeRoute.routeStatus === 'in-progress') return t('Pending...')

    return t('Proceed to Next Step')
  }, [
    activeRoute.route.currentUserTxIndex,
    activeRoute.route.totalUserTx,
    activeRoute.routeStatus,
    statuses.buildSwapAndBridgeUserRequest,
    t
  ])

  const getPanelContainerStyle = useCallback(() => {
    let panelStyles = {}
    if (activeRoute.error)
      panelStyles = {
        borderWidth: 1,
        backgroundColor: theme.errorBackground,
        borderColor: theme.errorDecorative
      }
    if (activeRoute.routeStatus === 'completed')
      panelStyles = {
        borderWidth: 1,
        backgroundColor: '#edf6f1',
        borderColor: theme.successDecorative
      }

    return { ...panelStyles, ...spacings.mbTy }
  }, [activeRoute.error, activeRoute.routeStatus, theme])

  return (
    <Panel forceContainerSmallSpacings style={getPanelContainerStyle()}>
      {activeRoute.routeStatus === 'completed' && (
        <Pressable style={styles.closeIcon} onPress={handleRejectActiveRoute}>
          <CloseIcon />
        </Pressable>
      )}
      <Text appearance="secondaryText" fontSize={14} weight="medium" style={spacings.mbMi}>
        {activeRoute.routeStatus === 'completed' ? t('Completed Route') : t('Pending Route')}
      </Text>
      <View
        style={[
          styles.container,
          activeRoute.routeStatus === 'completed' && { backgroundColor: '#767DAD14' }
        ]}
      >
        <RouteStepsPreview
          steps={steps}
          currentStep={
            activeRoute.routeStatus === 'completed'
              ? activeRoute.route.totalUserTx
              : activeRoute.route.currentUserTxIndex
          }
          loadingEnabled={
            !!activeRoute.userTxHash &&
            (activeRoute.routeStatus === 'in-progress' ||
              activeRoute.routeStatus === 'waiting-approval-to-resolve')
          }
        />
      </View>

      {activeRoute.routeStatus !== 'completed' && (
        <View style={[spacings.ptSm, flexbox.directionRow, flexbox.alignCenter]}>
          {!activeRoute.error && (
            <View style={[flexbox.directionRow, flexbox.flex1, flexbox.alignCenter]}>
              {activeRoute.routeStatus === 'in-progress' &&
                activeTransaction?.userTxType === 'fund-movr' && (
                  <>
                    <Text
                      fontSize={12}
                      weight="medium"
                      style={spacings.mrMi}
                      appearance="secondaryText"
                    >
                      {t('Estimated bridge time:')}
                    </Text>

                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      <Text
                        fontSize={12}
                        weight="medium"
                        appearance="primary"
                        style={spacings.mrTy}
                      >
                        {t('around')}{' '}
                        {formatTime((activeTransaction as SocketAPIBridgeUserTx)?.serviceTime)}
                      </Text>
                      <Spinner style={{ width: 16, height: 16 }} />
                    </View>
                  </>
                )}
              {activeRoute.routeStatus === 'in-progress' &&
                activeTransaction?.userTxType === 'dex-swap' && (
                  <>
                    <Text
                      fontSize={12}
                      weight="medium"
                      style={spacings.mrTy}
                      appearance="secondaryText"
                    >
                      {t('Swap in progress')}
                    </Text>
                    <Spinner style={{ width: 16, height: 16 }} />
                  </>
                )}
              {activeRoute.routeStatus === 'waiting-approval-to-resolve' && (
                <>
                  <Text
                    fontSize={12}
                    weight="medium"
                    style={spacings.mrTy}
                    appearance="secondaryText"
                  >
                    {t('Approval in progress')}
                  </Text>
                  <Spinner style={{ width: 16, height: 16 }} />
                </>
              )}
            </View>
          )}
          {!!activeRoute.error && (
            <Text
              fontSize={12}
              weight="medium"
              style={[spacings.mrTy, flexbox.flex1]}
              appearance="errorText"
            >
              {activeRoute.error}
            </Text>
          )}
          <Button
            text={rejectBtn.text}
            onPress={handleRejectActiveRoute}
            type={rejectBtn.type}
            size="small"
            style={
              activeRoute.routeStatus !== 'failed'
                ? { height: 40, ...spacings.mrTy }
                : { height: 40 }
            }
            hasBottomSpacing={false}
            disabled={statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'}
          />
          {activeRoute.routeStatus !== 'failed' && (
            <Button
              text={proceedBtnText}
              onPress={handleProceedToNextStep}
              size="small"
              style={{ height: 40 }}
              hasBottomSpacing={false}
              disabled={
                activeRoute.routeStatus !== 'ready' ||
                statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'
              }
            />
          )}
        </View>
      )}
    </Panel>
  )
}

export default React.memo(ActiveRouteCard)
