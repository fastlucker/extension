import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Card from '@web/modules/auth/components/Card'

const EmailAccountScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  return (
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
  )
}

export default EmailAccountScreen
