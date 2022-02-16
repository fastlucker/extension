import React from 'react'

import { useTranslation } from '@config/localization'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <Wrapper>
      <Title>{t('Import from JSON')}</Title>
      <Button
        disabled={inProgress}
        text={inProgress ? t('Importing...') : t('Select file')}
        onPress={handleLogin}
      />
      {!!error && <P type={TEXT_TYPES.DANGER}>{error}</P>}
    </Wrapper>
  )
}

export default JsonLoginScreen
