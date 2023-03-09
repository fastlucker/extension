import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, LayoutAnimation, TouchableWithoutFeedback, View } from 'react-native'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Segments from '@common/components/Segments'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import { triggerLayoutAnimation } from '@common/services/layoutAnimation'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import CreateAccountForm from '@modules/auth/components/CreateAccountForm'
import EmailLoginForm from '@modules/auth/components/EmailLoginForm'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  EMAIL_LOGIN = 'Login with Email',
  CREATE_ACCOUNT = 'Create Account'
}

const segments = [{ value: FORM_TYPE.EMAIL_LOGIN }, { value: FORM_TYPE.CREATE_ACCOUNT }]

const EmailLoginScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.EMAIL_LOGIN)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formType === FORM_TYPE.CREATE_ACCOUNT ? t('Create new Account') : t('Login')
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
            {formType === FORM_TYPE.EMAIL_LOGIN && <EmailLoginForm />}
            {formType === FORM_TYPE.CREATE_ACCOUNT && <CreateAccountForm />}
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default EmailLoginScreen
