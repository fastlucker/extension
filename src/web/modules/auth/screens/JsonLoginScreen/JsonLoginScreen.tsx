import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useJsonLogin from '@common/modules/auth/hooks/useJsonLogin'
import spacings from '@common/styles/spacings'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={styles.mainContentWrapper}>
          <Button
            disabled={inProgress}
            text={inProgress ? t('Importing...') : t('Import JSON')}
            onPress={() => handleLogin({})}
            hasBottomSpacing={!error || isWeb}
          />
          {!!error && (
            <View style={spacings.ptTy}>
              <Text appearance="danger" fontSize={12} style={spacings.ph}>
                {error}
              </Text>
            </View>
          )}
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb}>
          {t('Import JSON')}
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

export default JsonLoginScreen
