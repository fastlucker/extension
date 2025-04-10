import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import Button from '@common/components/Button'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'

type Props = {
  isOneClickModeAllowed: boolean
  isNotReadyToProceed: boolean
  handleSubmitForm: (isOneClickMode: boolean) => void
  isEstimatingRoute: boolean
  formStatus: SwapAndBridgeFormStatus
}

const Buttons: FC<Props> = ({
  isOneClickModeAllowed,
  isNotReadyToProceed,
  handleSubmitForm,
  isEstimatingRoute,
  formStatus
}) => {
  const { statuses: mainCtrlStatuses } = useMainControllerState()
  const { t } = useTranslation()

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyEnd]}>
      <Button
        hasBottomSpacing={false}
        text={isOneClickModeAllowed ? t('Start a batch') : t('Add to batch')}
        disabled={isNotReadyToProceed}
        type="secondary"
        style={{ minWidth: 160 }}
        onPress={() => handleSubmitForm(false)}
      />
      <Button
        text={
          mainCtrlStatuses.buildSwapAndBridgeUserRequest !== 'INITIAL' ||
          isEstimatingRoute ||
          formStatus === SwapAndBridgeFormStatus.FetchingRoutes
            ? t('Loading...')
            : t('Proceed')
        }
        disabled={isNotReadyToProceed || !isOneClickModeAllowed}
        style={{ minWidth: 160, ...spacings.mlLg }}
        hasBottomSpacing={false}
        onPress={() => handleSubmitForm(true)}
      />
    </View>
  )
}

export default Buttons
