import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Title from '@modules/common/components/Title'

const LocalAuth = () => {
  const { t } = useTranslation()

  return (
    <>
      <Title>{t('Local authentication')}</Title>
      <Button text={t('Enable')} />
    </>
  )
}

export default LocalAuth
