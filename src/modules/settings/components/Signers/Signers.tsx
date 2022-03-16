import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@modules/common/components/Button'
import { useNavigation } from '@react-navigation/native'

const Signers = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const goToSigners = () => navigation.navigate('signers')

  return <Button text={t('Hardware wallet signers')} onPress={goToSigners} />
}

export default Signers
