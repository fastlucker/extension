import React from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import { isWeb } from '@common/config/env'
import spacings from '@common/styles/spacings'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  EMAIL_LOGIN = 'Login with Email',
  CREATE_ACCOUNT = 'Create Account'
}

const EmailLoginScreen = () => {
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

export default EmailLoginScreen
