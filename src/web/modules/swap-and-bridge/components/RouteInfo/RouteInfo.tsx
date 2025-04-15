import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
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
  isAutoSelectRouteDisabled: boolean
  openRoutesModal: () => void
}

const RouteInfo: FC<Props> = ({
  isEstimatingRoute,
  shouldEnableRoutesSelection,
  isAutoSelectRouteDisabled,
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
      {formStatus === SwapAndBridgeFormStatus.NoRoutesFound && (
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <WarningIcon width={14} height={14} color={theme.warningDecorative} />
          <Text fontSize={14} weight="medium" appearance="warningText" style={spacings.mlMi}>
            {t('No routes found!')}
          </Text>
        </View>
      )}
      {[
        SwapAndBridgeFormStatus.InvalidRouteSelected,
        SwapAndBridgeFormStatus.ReadyToEstimate,
        SwapAndBridgeFormStatus.ReadyToSubmit,
        SwapAndBridgeFormStatus.Proceeded
      ].includes(formStatus) &&
        (signAccountOpController?.estimation.status === EstimationStatus.Success ||
          (signAccountOpController?.estimation.status === EstimationStatus.Error &&
            isAutoSelectRouteDisabled)) &&
        !isEstimatingRoute && (
          <>
            {signAccountOpController?.estimation.status === EstimationStatus.Success && (
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
            {signAccountOpController?.estimation.status === EstimationStatus.Error && (
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <WarningIcon width={14} height={14} color={theme.warningDecorative} />
                <Text fontSize={14} weight="medium" appearance="warningText" style={spacings.mlMi}>
                  {signAccountOpController?.estimation.error?.message}
                </Text>
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
