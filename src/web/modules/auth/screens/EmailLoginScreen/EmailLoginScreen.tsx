import React, { useLayoutEffect, useState } from 'react'
import { LayoutAnimation, View } from 'react-native'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Segments from '@common/components/Segments'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import AmbireLogo from '@common/modules/auth/components/AmbireLogo'
import CreateAccountForm from '@common/modules/auth/components/CreateAccountForm'
import EmailLoginForm from '@common/modules/auth/components/EmailLoginForm'
import { triggerLayoutAnimation } from '@common/services/layoutAnimation'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'

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
    <>
      <AuthLayoutWrapperMainContent>
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
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent>
        <Text weight="regular" fontSize={16} style={spacings.mb}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae harum eaque
          repellendus porro in ea architecto, ullam facere fugit. Obcaecati eius impedit magnam,
          voluptates voluptatibus ex assumenda similique exercitationem repellat harum facere nemo
          voluptate illum eaque praesentium ut accusantium, quasi earum quo. Necessitatibus at
          aperiam veritatis repellendus, nesciunt veniam eum!
        </Text>
        <Text weight="regular" fontSize={16}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae harum eaque
          repellendus porro in ea architecto, ullam facere fugit. Obcaecati eius impedit magnam,
          voluptates voluptatibus ex assumenda similique exercitationem repellat harum facere nemo
          voluptate illum eaque praesentium ut accusantium, quasi earum quo. Necessitatibus at
          aperiam veritatis repellendus, nesciunt veniam eum!
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default EmailLoginScreen
