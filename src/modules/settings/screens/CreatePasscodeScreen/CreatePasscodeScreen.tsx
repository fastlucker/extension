import * as SecureStore from 'expo-secure-store'
import React from 'react'

import { useTranslation } from '@config/localization'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useToast from '@modules/common/hooks/useToast'
import { SECURE_STORE_KEY } from '@modules/settings/constants'
import { useNavigation } from '@react-navigation/native'

const CreatePasscodeScreen: React.FC = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()

  const handleOnFulfill = async (code: string) => {
    await SecureStore.setItemAsync(SECURE_STORE_KEY, code)
    addToast(t('Passcode configured!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  return (
    <Wrapper>
      <Title>{t('Create Passcode')}</Title>
      <P>{t('Choose a passcode to protect your app.')}</P>
      <CodeInput onFulfill={handleOnFulfill} />
    </Wrapper>
  )
}

export default CreatePasscodeScreen
