import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { FEE_PERCENT } from '@ambire-common/services/socket/constants'
import InfoIcon from '@common/assets/svg/InfoIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatTime from '@common/utils/formatTime'
import useInviteControllerState from '@web/hooks/useInviteControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import SelectRoute from './SelectRoute'

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
  const { formStatus, signAccountOpController, quote, swapSignErrors, errors } =
    useSwapAndBridgeControllerState()
  const { isOG } = useInviteControllerState()
  const { theme } = useTheme()
  const { t } = useTranslation()

  const noRoutesFoundError = errors.find(({ id }) => id === 'no-routes')?.title
  const allRoutesFailedError = errors.find(({ id }) => id === 'all-routes-failed')

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
      {swapSignErrors.length > 0 && (
        <View style={[flexbox.directionRow, flexbox.alignCenter, { maxWidth: '100%' }]}>
          <WarningIcon width={14} height={14} color={theme.warningDecorative} />
          <Text fontSize={14} weight="medium" appearance="warningText" style={spacings.mlMi}>
            {swapSignErrors[0].title}
          </Text>
        </View>
      )}
      {swapSignErrors.length === 0 && formStatus === SwapAndBridgeFormStatus.NoRoutesFound && (
        <View style={[flexbox.directionRow, flexbox.alignCenter, { maxWidth: '100%' }]}>
          <WarningIcon width={14} height={14} color={theme.warningDecorative} />
          <Text fontSize={14} weight="medium" appearance="warningText" style={spacings.mlMi}>
            {noRoutesFoundError
              ? t(`No routes found. Reason: ${noRoutesFoundError}`)
              : t('No routes found')}
          </Text>
        </View>
      )}
      {swapSignErrors.length === 0 &&
        [
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
            {signAccountOpController?.estimation.status === EstimationStatus.Success &&
              formStatus !== SwapAndBridgeFormStatus.InvalidRouteSelected && (
                <View
                  style={[
                    flexbox.directionRow,
                    flexbox.alignCenter,
                    flexbox.justifySpaceBetween,
                    { width: '100%' }
                  ]}
                >
                  <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                    <Text appearance="tertiaryText" fontSize={14} weight="medium">
                      {t('Ambire fee: {{fee}}', {
                        fee: isOG ? "0% - you're an OG 🎉" : `${FEE_PERCENT}%`
                      })}
                    </Text>
                    {quote?.selectedRoute?.serviceTime ? (
                      <Text
                        appearance="tertiaryText"
                        fontSize={14}
                        weight="medium"
                        style={spacings.mlLg}
                      >
                        {t('Time: {{time}}', {
                          time:
                            quote?.selectedRoute.fromChainId !== quote?.selectedRoute.toChainId
                              ? `~ ${formatTime(quote?.selectedRoute?.serviceTime)}`
                              : 'instant'
                        })}
                      </Text>
                    ) : null}
                  </View>

                  <SelectRoute
                    shouldEnableRoutesSelection={shouldEnableRoutesSelection}
                    openRoutesModal={openRoutesModal}
                  />
                </View>
              )}
            {(signAccountOpController?.estimation.status === EstimationStatus.Error ||
              formStatus === SwapAndBridgeFormStatus.InvalidRouteSelected) && (
              <View
                style={[
                  flexbox.directionRow,
                  flexbox.alignCenter,
                  flexbox.justifySpaceBetween,
                  { width: '100%' }
                ]}
              >
                {allRoutesFailedError ? (
                  <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                    <WarningIcon width={14} height={14} color={theme.warningDecorative} />
                    <Text
                      fontSize={14}
                      weight="medium"
                      appearance="warningText"
                      style={spacings.mlMi}
                    >
                      {allRoutesFailedError.text}
                    </Text>
                    <Pressable
                      style={{
                        paddingVertical: 2,
                        ...spacings.phTy,
                        ...flexbox.directionRow,
                        ...flexbox.alignCenter,
                        opacity: 1
                      }}
                      onPress={openRoutesModal as any}
                    >
                      <Text
                        fontSize={14}
                        weight="medium"
                        color={theme.warningText}
                        style={{
                          ...spacings.mr,
                          textDecorationColor: theme.warningText,
                          textDecorationLine: 'underline'
                        }}
                      >
                        {t('See details')}
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                    <WarningIcon width={14} height={14} color={theme.warningDecorative} />
                    <Text
                      fontSize={14}
                      weight="medium"
                      appearance="warningText"
                      style={spacings.mlMi}
                    >
                      {t('An error occurred. More details:')}
                    </Text>
                    <InfoIcon
                      width={16}
                      height={16}
                      data-tooltip-id="error-info-icon"
                      style={spacings.mlTy}
                    />
                    <Tooltip id="error-info-icon" clickable>
                      <View>
                        <Text fontSize={14} appearance="secondaryText" style={spacings.mbMi}>
                          {quote && quote.selectedRoute && quote.selectedRoute.disabled
                            ? quote.selectedRoute.disabledReason
                            : signAccountOpController?.estimation.error?.message}
                        </Text>
                      </View>
                    </Tooltip>
                  </View>
                )}

                {!allRoutesFailedError && (
                  <SelectRoute
                    shouldEnableRoutesSelection={shouldEnableRoutesSelection}
                    openRoutesModal={openRoutesModal}
                  />
                )}
              </View>
            )}
          </>
        )}
    </View>
  )
}

export default RouteInfo
