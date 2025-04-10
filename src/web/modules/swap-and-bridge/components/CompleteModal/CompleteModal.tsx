import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'

type Props = {
  sheetRef: React.RefObject<any>
  closeBottomSheet: () => void
  type: 'track' | 'batch'
}

const CompleteModal: FC<Props> = ({ sheetRef, type, closeBottomSheet }) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { activeRoutes } = useSwapAndBridgeControllerState()

  // @TODO: Improve this
  const lastCompletedRoute = activeRoutes[activeRoutes.length - 1]
  const steps = lastCompletedRoute.route?.steps
  const toAssetSymbol = steps ? steps[steps.length - 1].toAsset.symbol : null

  const onSecondaryButtonPress = useCallback(() => {
    if (type === 'batch') {
      // Handle batch
      return
    }

    // Handle swap or bridge
    closeBottomSheet()
  }, [closeBottomSheet, type])
  const onPrimaryButtonPress = useCallback(() => {
    if (type === 'batch') {
      // Handle batch
      return
    }

    navigate(WEB_ROUTES.dashboard)
  }, [navigate, type])

  return (
    <BottomSheet sheetRef={sheetRef} closeBottomSheet={closeBottomSheet} id="complete-modal">
      {type === 'batch' ? (
        <View>TODO: Batch markup</View>
      ) : (
        <View>
          {lastCompletedRoute.routeStatus === 'in-progress' && <Spinner />}
          {lastCompletedRoute.routeStatus === 'completed' && (
            <>
              <Text fontSize={20} weight="medium" style={spacings.mbTy}>
                {t('Nice trade!')}
              </Text>
              <Text weight="medium" appearance="secondaryText">
                {t('{{symbol}} delivered - like magic.', {
                  symbol: toAssetSymbol || 'Token'
                })}
              </Text>
            </>
          )}
          {lastCompletedRoute.routeStatus === 'failed' && <Text>{t('TODO: Error state')}</Text>}
        </View>
      )}

      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
        <Button onPress={onSecondaryButtonPress} hasBottomSpacing={false} type="secondary">
          {t('Start a new swap?')}
        </Button>
        <Button onPress={onPrimaryButtonPress} hasBottomSpacing={false} style={{ width: 160 }}>
          {t('Close')}
        </Button>
      </View>
    </BottomSheet>
  )
}

export default CompleteModal
