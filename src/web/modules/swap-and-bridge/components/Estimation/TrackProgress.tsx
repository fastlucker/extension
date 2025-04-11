import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CheckIcon2 from '@common/assets/svg/CheckIcon2'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'

import BackgroundShapes from './BackgroundShapes'

type Props = {
  handleClose: () => void
}

const TrackProgress: FC<Props> = ({ handleClose }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const { activeRoutes } = useSwapAndBridgeControllerState()

  // @TODO: Pick the right route as the user may have started
  // another route before this one. Also, currently we are not even starting routes
  // if the swap is one-click.
  // This is implementation was written solely for the purpose of testing the UI
  const lastCompletedRoute = activeRoutes[activeRoutes.length - 1]
  const steps = lastCompletedRoute?.route?.steps
  const toAssetSymbol = steps ? steps[steps.length - 1].toAsset.symbol : null

  const onPrimaryButtonPress = useCallback(() => {
    navigate(WEB_ROUTES.dashboard)
  }, [navigate])
  return (
    <View>
      <View style={[flexbox.alignCenter, flexbox.justifyCenter, spacings.pt2Xl]}>
        {/* TODO: This is the only thing that would render at the moment as we are not starting routes 
        if the swap is one-click. */}
        {(!lastCompletedRoute || lastCompletedRoute?.routeStatus === 'in-progress') && (
          <>
            <Text fontSize={20} weight="medium" style={spacings.mbXl}>
              {t('Confirming your trade')}
            </Text>
            <Spinner
              style={{
                width: 32,
                height: 32,
                ...spacings.mb2Xl
              }}
            />
          </>
        )}
        {lastCompletedRoute?.routeStatus === 'completed' && (
          <>
            <BackgroundShapes
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            <CheckIcon2 style={spacings.mb3Xl} />
            <Text fontSize={20} weight="medium" style={spacings.mbTy}>
              {t('Nice trade!')}
            </Text>
            <Text weight="medium" appearance="secondaryText" style={spacings.mb2Xl}>
              {t('{{symbol}} delivered - like magic.', {
                symbol: toAssetSymbol || 'Token'
              })}
            </Text>
            <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyCenter]}>
              <OpenIcon color={theme.primary} width={16} height={16} style={spacings.mrTy} />
              <Text
                weight="medium"
                style={{
                  textDecorationLine: 'underline',
                  textDecorationColor: theme.primary,
                  textDecorationStyle: 'solid'
                }}
                appearance="primary"
                // @TODO: Add Functionality
              >
                {t('Open in Explorer')}
              </Text>
            </View>
          </>
        )}
        {lastCompletedRoute?.routeStatus === 'failed' && <Text>{t('TODO: Error state')}</Text>}
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: theme.secondaryBorder,
          ...spacings.mvLg
        }}
      />
      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
        <Button
          onPress={handleClose}
          hasBottomSpacing={false}
          type="secondary"
          text={t('Start a new swap?')}
        />
        <Button
          onPress={onPrimaryButtonPress}
          hasBottomSpacing={false}
          style={{ width: 160 }}
          text={t('Close')}
        />
      </View>
    </View>
  )
}

export default TrackProgress
