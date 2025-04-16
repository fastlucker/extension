import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

type Props = {
  isOneClickModeAllowed: boolean
  isNotReadyToProceed: boolean
  isBatchAllowed: boolean
  handleSubmitForm: (isOneClickMode: boolean) => void
}

const Buttons: FC<Props> = ({
  isOneClickModeAllowed,
  isNotReadyToProceed,
  handleSubmitForm,
  isBatchAllowed
}) => {
  const { t } = useTranslation()
  const { isActionWindow } = getUiType()

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyEnd]}>
      {!isActionWindow && (
        <Button
          hasBottomSpacing={false}
          text={isOneClickModeAllowed ? t('Start a batch') : t('Add to batch')}
          disabled={isNotReadyToProceed || !isBatchAllowed}
          type="secondary"
          style={{ minWidth: 160 }}
          onPress={() => handleSubmitForm(false)}
        />
      )}
      <Button
        text={t('Proceed')}
        disabled={isNotReadyToProceed || !isOneClickModeAllowed}
        style={{ minWidth: 160, ...spacings.mlLg }}
        hasBottomSpacing={false}
        onPress={() => handleSubmitForm(true)}
        testID="proceed-btn"
      />
    </View>
  )
}

export default Buttons
