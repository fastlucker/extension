import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ActiveRoute } from '@ambire-common/interfaces/swapAndBridge'
import { getQuoteRouteSteps } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import ClockIcon from '@common/assets/svg/ClockIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import RouteStepsPreview from '@web/modules/swap-and-bridge/components/RouteStepsPreview'

import getStyles from './styles'

const ActiveRouteCard = ({ activeRoute }: { activeRoute: ActiveRoute }) => {
  const [remainingTime, setRemainingTime] = useState(activeRoute.route.serviceTime)
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { statuses } = useMainControllerState()

  useEffect(() => {
    if (!activeRoute.route.serviceTime) return

    if (activeRoute.routeStatus && activeRoute.routeStatus !== 'in-progress') {
      return
    }

    if (remainingTime <= 0) return

    const timeout = setTimeout(() => setRemainingTime((prev) => prev - 1), 1000)

    return () => clearTimeout(timeout)
  }, [remainingTime, activeRoute.route.serviceTime, activeRoute.routeStatus])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }

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

  return (
    <Panel forceContainerSmallSpacings>
      <Text appearance="secondaryText" fontSize={14} weight="medium" style={spacings.mbMi}>
        {t('Pending Route')}
      </Text>
      <View style={styles.container}>
        <RouteStepsPreview steps={steps} />
      </View>

      <View style={[spacings.ptSm, flexbox.directionRow, flexbox.alignCenter]}>
        <View style={[flexbox.directionRow, flexbox.flex1, flexbox.alignCenter]}>
          {!!activeRoute.route.serviceTime && activeRoute.routeStatus === 'in-progress' && (
            <>
              <Text fontSize={12} weight="medium" style={spacings.mrTy} appearance="secondaryText">
                {t('Bridging in progress')}
              </Text>
              {!!activeRoute.route.serviceTime && (
                <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                  <ClockIcon color={iconColors.dark} style={spacings.mrTy} />
                  <Text fontSize={12} weight="medium" appearance="primaryText">
                    {formatTime(remainingTime)}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        <Button
          text={t('Reject')}
          onPress={handleRejectActiveRoute}
          type="danger"
          size="small"
          style={{ height: 40, ...spacings.mrTy }}
          hasBottomSpacing={false}
          disabled={
            activeRoute.routeStatus !== 'ready' ||
            statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'
          }
        />
        <Button
          text={
            statuses.buildSwapAndBridgeUserRequest !== 'INITIAL'
              ? t('Building Transaction...')
              : t('Proceed to Next Step')
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
    </Panel>
  )
}

export default React.memo(ActiveRouteCard)
