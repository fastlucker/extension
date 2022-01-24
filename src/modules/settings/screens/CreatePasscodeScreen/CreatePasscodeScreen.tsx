import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

const CreatePasscodeScreen: React.FC = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { hasPasscode, removePasscode, addPasscode } = usePasscode()

  const handleOnFulfill = async (code: string) => {
    await addPasscode(code)

    addToast(t('Passcode configured!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  const handleOnRemovePasscode = async () => {
    await removePasscode()

    addToast(t('Passcode removed!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  return (
    <Wrapper>
      <Title>{t('Create Passcode')}</Title>
      <P>{t('Choose a passcode to protect your app.')}</P>
      <CodeInput onFulfill={handleOnFulfill} />
      {hasPasscode && (
        <>
          <Text style={[textStyles.center, spacings.mv]}>{t('– or –')}</Text>
          <Button text={t('Remove passcode')} onPress={handleOnRemovePasscode} />
        </>
      )}
    </Wrapper>
  )
}

export default CreatePasscodeScreen
