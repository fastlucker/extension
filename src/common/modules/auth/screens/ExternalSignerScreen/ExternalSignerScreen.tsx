import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import spacings from '@common/styles/spacings'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  PRIVATE_KEY = 'Private Key',
  RECOVERY_PHRASE = 'Recovery Phrase'
}

const ExternalSignerScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.PRIVATE_KEY)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        formType === FORM_TYPE.RECOVERY_PHRASE
          ? t('Login with Recovery Phrase')
          : t('Login with Private Key')
    })
  }, [formType, navigation, t])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        !isWeb && Keyboard.dismiss()
      }}
    >
      <ScrollableWrapper
        contentContainerStyle={spacings.pbLg}
        type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
        extraHeight={220}
      >
        {/* TODO: v2 */}
      </ScrollableWrapper>
    </TouchableWithoutFeedback>
  )
}

export default ExternalSignerScreen
