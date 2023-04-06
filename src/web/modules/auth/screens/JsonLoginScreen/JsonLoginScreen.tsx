import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useJsonLogin from '@common/modules/auth/hooks/useJsonLogin'
import colors from '@common/styles/colors'
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
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          {t('Import JSON')}
        </Text>
        <Text weight="regular" color={colors.titan}>
          {t('Upload a JSON file to quickly and securely access your existing wallet.')}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default JsonLoginScreen
