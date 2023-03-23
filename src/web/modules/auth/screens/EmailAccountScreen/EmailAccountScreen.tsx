import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/config/routesConfig'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import Card from '@web/modules/auth/components/Card'

const EmailAccountScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={[flexbox.directionRow, flexbox.justifyCenter]}>
          <Card
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, rerum?"
            style={spacings.mr}
          >
            <Button
              hasBottomSpacing={false}
              text={t('Log In')}
              onPress={() => navigate(ROUTES.authEmailLogin)}
            />
          </Card>
          <Card
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, rerum?"
            style={spacings.ml}
          >
            <Button
              hasBottomSpacing={false}
              text={t('Create New')}
              onPress={() => navigate(ROUTES.authEmailRegister)}
            />
          </Card>
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
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

export default EmailAccountScreen
