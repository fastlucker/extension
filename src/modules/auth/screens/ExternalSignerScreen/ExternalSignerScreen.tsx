import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, LayoutAnimation, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import PassphraseForm from '@modules/auth/components/PassphraseForm'
import PrivateKeyForm from '@modules/auth/components/PrivateKeyForm'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Segments from '@modules/common/components/Segments'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  PRIVATE_KEY = 'Private Key',
  PASSPHRASE = 'Passphrase'
}

const segments = [{ value: FORM_TYPE.PRIVATE_KEY }, { value: FORM_TYPE.PASSPHRASE }]

const ExternalSignerScreen = ({ navigation }: any) => {
  const { t } = useTranslation()

  const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.PRIVATE_KEY)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        formType === FORM_TYPE.PASSPHRASE ? t('Login with Passphrase') : t('Login with Private Key')
    })
  }, [formType])

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
            {formType === FORM_TYPE.PASSPHRASE && <PassphraseForm />}
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default ExternalSignerScreen
