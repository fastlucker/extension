import React from 'react'
import { View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

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
