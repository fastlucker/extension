import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import { useNavigation } from '@react-navigation/native'

const CreateLocalAuthScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { isLocalAuthSupported, addLocalAuth, hasLocalAuth, removeLocalAuth } = usePasscode()

  const handleEnable = async () => {
    await addLocalAuth()

    addToast(t('Local auth enabled!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  const handleDisable = async () => {
    await removeLocalAuth()

    addToast(t('Local auth disabled!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  return (
    <Wrapper>
      <Title>{t('Local authentication')}</Title>
      <P>
        {isLocalAuthSupported
          ? t('Local auth is available on this device')
          : t('Your device is not compatible with Local auth')}
      </P>
      {isLocalAuthSupported &&
        (hasLocalAuth ? (
          <Button onPress={handleDisable} text={t('Disable')} />
        ) : (
          <Button onPress={handleEnable} text={t('Enable')} />
        ))}
    </Wrapper>
  )
}

export default CreateLocalAuthScreen
