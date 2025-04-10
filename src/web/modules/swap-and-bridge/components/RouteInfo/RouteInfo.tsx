import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatTime from '@common/utils/formatTime'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'

type Props = {
  isEstimatingRoute: boolean
  shouldEnableRoutesSelection: boolean
  openRoutesModal: () => void
}

const RouteInfo: FC<Props> = ({
  isEstimatingRoute,
  shouldEnableRoutesSelection,
  openRoutesModal
}) => {
  const { formStatus, signAccountOpController, quote } = useSwapAndBridgeControllerState()
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        {
          height: 25 // Prevents layout shifts
        },
        spacings.mbLg
      ]}
    >
      {[
        SwapAndBridgeFormStatus.FetchingRoutes,
        SwapAndBridgeFormStatus.NoRoutesFound,
        SwapAndBridgeFormStatus.InvalidRouteSelected,
        SwapAndBridgeFormStatus.ReadyToEstimate,
        SwapAndBridgeFormStatus.ReadyToSubmit
      ].includes(formStatus) &&
        signAccountOpController?.estimation &&
        !isEstimatingRoute && (
          <>
            {formStatus === SwapAndBridgeFormStatus.NoRoutesFound ? (
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <WarningIcon width={14} height={14} color={theme.warningDecorative} />
                <Text fontSize={14} weight="medium" appearance="warningText" style={spacings.mlMi}>
                  {t('No routes found!')}
                </Text>
              </View>
            ) : (
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <Text appearance="tertiaryText" fontSize={14} weight="medium">
                  {t('Ambire fee: 0.025%')}
                </Text>
                {quote?.selectedRoute?.serviceTime ? (
                  <Text
                    appearance="tertiaryText"
                    fontSize={14}
                    weight="medium"
                    style={spacings.mlLg}
                  >
                    {t('Time: ~')} {formatTime(quote?.selectedRoute?.serviceTime)}
                  </Text>
                ) : null}
              </View>
            )}

            <Pressable
              style={{
                paddingVertical: 2,
                ...spacings.phTy,
                ...flexbox.directionRow,
                ...flexbox.alignCenter,
                opacity: shouldEnableRoutesSelection ? 1 : 0.5
              }}
              onPress={openRoutesModal as any}
              disabled={!shouldEnableRoutesSelection}
            >
              <Text
                fontSize={14}
                weight="medium"
                appearance="primary"
                style={{
                  ...spacings.mr,
                  textDecorationColor: theme.primary,
                  textDecorationLine: 'underline'
                }}
              >
                {t('Select route')}
              </Text>
              <RightArrowIcon weight="2" width={5} height={16} color={theme.primary} />
            </Pressable>
          </>
        )}
    </View>
  )
}

export default RouteInfo
