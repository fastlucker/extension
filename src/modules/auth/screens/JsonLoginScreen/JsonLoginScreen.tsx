import React from 'react'

import { useTranslation } from '@config/localization'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Title>{t('Import from JSON')}</Title>
        <Button
          disabled={inProgress}
          text={inProgress ? t('Importing...') : t('Select file')}
          onPress={handleLogin}
        />
        {!!error && (
          <Text appearance="danger" style={spacings.mbSm}>
            {error}
          </Text>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default JsonLoginScreen
