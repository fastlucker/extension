import React, { useLayoutEffect, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import CreateAccountForm from '@modules/auth/components/CreateAccountForm'
import EmailLoginForm from '@modules/auth/components/EmailLoginForm'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Segments from '@modules/common/components/Segments'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  EMAIL_LOGIN = 'Login with Email',
  CREATE_ACCOUNT = 'Create Account'
}

const segments = [{ value: FORM_TYPE.EMAIL_LOGIN }, { value: FORM_TYPE.CREATE_ACCOUNT }]

const EmailLoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation()

  const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.EMAIL_LOGIN)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formType === FORM_TYPE.CREATE_ACCOUNT ? t('Create new Account') : t('Login')
    })
  }, [formType])

  return (
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <Wrapper
          contentContainerStyle={spacings.pbLg}
          type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
          extraHeight={220}
        >
          <AmbireLogo shouldExpand={false} />
          <View style={[spacings.mbLg, spacings.ptSm, spacings.ph]}>
            <Segments
              defaultValue={formType}
              segments={segments}
              onChange={(value: FORM_TYPE) => setFormType(value)}
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
