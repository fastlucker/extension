import React, { useState } from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

enum STEPS {
  NEW_PASSCODE = 'NEW_PASSCODE',
  CONFIRM_NEW_PASSCODE = 'CONFIRM_NEW_PASSCODE'
}

const ChangePasscodeScreen: React.FC = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { addToast } = useToast()
  const { state, removePasscode, addPasscode } = usePasscode()
  const [step, setStep] = useState<STEPS>(STEPS.NEW_PASSCODE)
  const [newPasscode, setNewPasscode] = useState('')
  const [passcodeConfirmFailed, setPasscodeConfirmFailed] = useState(false)

  const handleOnFulfillStep1 = (code: string) => {
    setStep(STEPS.CONFIRM_NEW_PASSCODE)
    return setNewPasscode(code)
  }

  const handleOnFulfillStep2 = async (code: string) => {
    if (code !== newPasscode) {
      return setPasscodeConfirmFailed(true)
    }

    const added = await addPasscode(code)
    if (added) {
      addToast(t('Passcode configured!') as string, { timeout: 2000 })
      navigation.navigate('settings')
    }
  }

  const handleOnRemovePasscode = async () => {
    await removePasscode()

    addToast(t('Passcode removed!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  const renderContent = () => {
    if (step === STEPS.CONFIRM_NEW_PASSCODE) {
      return (
        <>
          <Title>{t('Confirm new passcode')}</Title>
          <P>{t('Please type the passcode again, to confirm it.')}</P>
        </>
      )
    }

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
    <GradientBackgroundWrapper>
      <Wrapper>
        {renderContent()}
        {passcodeConfirmFailed && <P type={TEXT_TYPES.DANGER}>{t("Passcodes don't match!")}</P>}
        {step === STEPS.NEW_PASSCODE && <CodeInput autoFocus onFulfill={handleOnFulfillStep1} />}
        {step === STEPS.CONFIRM_NEW_PASSCODE && (
          <CodeInput autoFocus onFulfill={handleOnFulfillStep2} />
        )}
        {state !== PASSCODE_STATES.NO_PASSCODE && (
          <>
            <Text style={[textStyles.center, spacings.mtTy, spacings.mbLg]}>{t('– or –')}</Text>
            <Button type="secondary" text={t('Remove passcode')} onPress={handleOnRemovePasscode} />
          </>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ChangePasscodeScreen
