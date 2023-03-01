import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, LayoutAnimation, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import PrivateKeyForm from '@modules/auth/components/PrivateKeyForm'
import RecoveryPhraseForm from '@modules/auth/components/RecoveryPhraseForm'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Segments from '@modules/common/components/Segments'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useNavigation from '@modules/common/hooks/useNavigation'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  PRIVATE_KEY = 'Private Key',
  RECOVERY_PHRASE = 'Recovery Phrase'
}

const segments = [{ value: FORM_TYPE.PRIVATE_KEY }, { value: FORM_TYPE.RECOVERY_PHRASE }]

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
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          !isWeb && Keyboard.dismiss()
        }}
      >
        <Wrapper
          contentContainerStyle={spacings.pbLg}
          type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
          extraHeight={220}
        >
          <AmbireLogo shouldExpand={false} />
          <View style={[spacings.mbLg, spacings.ph]}>
            <Segments
              defaultValue={formType}
              segments={segments}
              onChange={(value: FORM_TYPE) => {
                setFormType(value)
                triggerLayoutAnimation({
                  forceAnimate: true,
                  config: LayoutAnimation.create(300, 'linear', 'opacity')
                })
              }}
              fontSize={14}
            />
          </View>
          <View style={[flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
            {formType === FORM_TYPE.PRIVATE_KEY && <PrivateKeyForm />}
            {formType === FORM_TYPE.RECOVERY_PHRASE && <RecoveryPhraseForm />}
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default ExternalSignerScreen
