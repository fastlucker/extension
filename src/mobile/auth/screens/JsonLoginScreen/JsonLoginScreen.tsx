import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'
import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@mobile/auth/components/AmbireLogo'
import useJsonLogin from '@mobile/auth/hooks/useJsonLogin'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <GradientBackgroundWrapper>
      <Wrapper contentContainerStyle={spacings.pbLg}>
        <AmbireLogo />
        <Button
          disabled={inProgress}
          text={inProgress ? t('Importing...') : t('Select File')}
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
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default JsonLoginScreen
