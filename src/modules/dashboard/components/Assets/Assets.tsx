import React from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Title from '@modules/common/components/Title'

import Tokens from '../Tokens'

const Balances = () => {
  const { t } = useTranslation()

  return (
    <Panel>
      <Title>{t('Assets')}</Title>
      <Tokens />
    </Panel>
  )
}

export default Balances
