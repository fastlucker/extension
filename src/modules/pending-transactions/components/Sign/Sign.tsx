import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Panel from '@modules/common/components/Panel'
import Title from '@modules/common/components/Title'

const Send = ({ bundle, estimation }: any) => {
  const { t } = useTranslation()

  return (
    <Panel>
      <Title>{t('Sign')}</Title>
    </Panel>
  )
}

export default Send
