import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import EmailLoginForm from '@common/modules/auth/components/EmailLoginForm'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'

import styles from './styles'

const EmailLoginScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={styles.contentWrapper}>
          <EmailLoginForm themeType={THEME_TYPES.LIGHT} />
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
