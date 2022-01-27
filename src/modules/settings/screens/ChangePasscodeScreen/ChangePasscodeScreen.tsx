import React from 'react'

import { useTranslation } from '@config/localization'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

const ChangePasscodeScreen: React.FC = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { addToast } = useToast()
  const { state, removePasscode, addPasscode } = usePasscode()

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

  const renderContent = () => {
    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <Title>{t('Create passcode')}</Title>
          <P>{t('Choose a passcode to protect your app.')}</P>
        </>
      )
    }

    return (
      <>
        <Title>{t('Change your passcode')}</Title>
        <P>{t('Please enter a new passcode.')}</P>
      </>
    )
  }

  return (
    <Wrapper>
      {renderContent()}
      <CodeInput autoFocus onFulfill={handleOnFulfill} />
      {state !== PASSCODE_STATES.NO_PASSCODE && (
        <>
          <Text style={[textStyles.center, spacings.mtTy, spacings.mbLg]}>{t('– or –')}</Text>
          <Button
            type={BUTTON_TYPES.SECONDARY}
            text={t('Remove passcode')}
            onPress={handleOnRemovePasscode}
          />
        </>
      )}
    </Wrapper>
  )
}

export default ChangePasscodeScreen
