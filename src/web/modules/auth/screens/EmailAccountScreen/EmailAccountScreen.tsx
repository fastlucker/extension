import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Card from '@web/modules/auth/components/Card'

const EmailAccountScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  return (
    <>
      <TabLayoutWrapperMainContent>
        <View style={[flexbox.directionRow, flexbox.justifyCenter]}>
          <Card
            text="Sign in to your Ambire wallet using your email for a simple and secure access to your crypto."
            style={spacings.mr}
            onPress={() => navigate(ROUTES.authEmailLogin)}
            buttonText="Log In"
          />
          <Card
            text="Create a new Ambire wallet with just your email and start managing your crypto."
            style={spacings.ml}
            onPress={() => navigate(ROUTES.authEmailRegister)}
            buttonText="Create New"
          />
        </View>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          {t(
            "Explore Ambire's powerful and user-friendly wallet options by logging in with your existing account or registering a new one via email. Both options provide secure access to your crypto assets while making self-custody and management simple and intuitive."
          )}
        </Text>
        <Text weight="regular" fontSize={16} color={colors.titan}>
          {t(
            'Get started with Ambire today and enjoy a seamless experience tailored to your needs.'
          )}
        </Text>
      </TabLayoutWrapperSideContent>
    </>
  )
}

export default EmailAccountScreen
