import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ActiveRoute, SocketAPIBridgeUserTx } from '@ambire-common/interfaces/swapAndBridge'
import { getIsBridgeTxn, getQuoteRouteSteps } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import Button from '@common/components/Button'
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
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { statuses } = useMainControllerState()

  const activeTransaction = useMemo(() => {
    if (!activeRoute.route) return

    return activeRoute.route.userTxs[activeRoute.route.currentUserTxIndex]
  }, [activeRoute.route])

  const steps = useMemo(() => {
    return getQuoteRouteSteps(activeRoute.route.userTxs)
  }, [activeRoute.route.userTxs])

  const handleRejectActiveRoute = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_REMOVE_ACTIVE_ROUTE',
      params: { activeRouteId: activeRoute.activeRouteId }
    })
  }, [activeRoute.activeRouteId, dispatch])

  const handleProceedToNextStep = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_ACTIVE_ROUTE_BUILD_NEXT_USER_REQUEST',
      params: { activeRouteId: activeRoute.activeRouteId }
    })
  }, [activeRoute.activeRouteId, dispatch])

  const isNextTxnForBridging = useMemo(() => {
    const isBridgeTxn = activeRoute.route.userTxs.some((userTx) =>
      getIsBridgeTxn(userTx.userTxType)
    )
    return isBridgeTxn && activeRoute.route.currentUserTxIndex >= 1
  }, [activeRoute.route.currentUserTxIndex, activeRoute.route.userTxs])

  const isLastTxn = activeRoute.route.totalUserTx === activeRoute.route.currentUserTxIndex + 1

  return (
    <Panel
      forceContainerSmallSpacings
      style={
        activeRoute.routeStatus === 'completed'
          ? { backgroundColor: '#edf6f1', ...spacings.mbTy }
          : spacings.mbTy
      }
    >
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
          loadingEnabled={!!activeRoute.userTxHash && activeRoute.routeStatus === 'in-progress'}
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
                      style={spacings.mrTy}
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
            </View>
          )}
          {!!activeRoute.error && (
            <Text fontSize={12} weight="medium" style={spacings.mrTy} appearance="errorText">
              {activeRoute.error}
            </Text>
          )}
          <Button
            text={
              (isLastTxn && activeRoute.routeStatus === 'in-progress') || !isNextTxnForBridging
                ? t('Cancel')
                : t('Cancel Next Step')
            }
            onPress={handleRejectActiveRoute}
            type="danger"
            size="small"
            style={{ height: 40, ...spacings.mrTy }}
            hasBottomSpacing={false}
            disabled={statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'}
          />
          <Button
            text={
              statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'
                ? t('Building Transaction...')
                : isNextTxnForBridging
                ? t('Proceed to Next Step')
                : t('Proceed')
            }
            onPress={handleProceedToNextStep}
            size="small"
            style={{ height: 40 }}
            hasBottomSpacing={false}
            disabled={
              activeRoute.routeStatus !== 'ready' ||
              statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'
            }
          />
        </View>
      )}
    </Panel>
  )
}

export default React.memo(ActiveRouteCard)
