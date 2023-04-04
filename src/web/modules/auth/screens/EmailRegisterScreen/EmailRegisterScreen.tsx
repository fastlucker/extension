import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import CreateAccountForm from '@common/modules/auth/components/CreateAccountForm'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'

const EmailRegisterScreen = () => {
  const { t } = useTranslation()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={styles.mainContentWrapper}>
          <CreateAccountForm />
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae harum eaque
          repellendus porro in ea architecto, ullam facere fugit. Obcaecati eius impedit magnam,
          voluptates voluptatibus ex assumenda similique exercitationem repellat harum facere nemo
          voluptate illum eaque praesentium ut accusantium, quasi earum quo. Necessitatibus at
          aperiam veritatis repellendus, nesciunt veniam eum!
        </Text>
        <Text weight="regular" fontSize={16} color={colors.titan}>
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

export default EmailRegisterScreen
