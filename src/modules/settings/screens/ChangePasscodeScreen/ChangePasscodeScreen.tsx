import React, { useEffect, useState } from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { useIsFocused, useNavigation } from '@react-navigation/native'

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
  const isFocused = useIsFocused()

  // On going back (loosing routing focus), reset state, otherwise there is
  // no way for the user to reset this flow (other than kill the app).
  // Also, resets the state upon initial successful passcode configuring.
  useEffect(() => {
    return () => {
      setNewPasscode('')
      setPasscodeConfirmFailed(false)
      setStep(STEPS.NEW_PASSCODE)
    }
  }, [isFocused])

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
      addToast(t('Passcode configured!') as string, { timeout: 5000 })
      navigation.navigate('dashboard')
    }
  }

  const handleOnRemovePasscode = async () => {
    await removePasscode()

    addToast(t('Passcode removed!') as string, { timeout: 5000 })
    navigation.navigate('dashboard')
  }

  const renderContent = () => {
    if (step === STEPS.CONFIRM_NEW_PASSCODE) {
      return (
        <>
          <Title style={textStyles.center}>{t('Confirm new passcode')}</Title>
          <Text type="small" style={spacings.mbSm}>
            {t('Please type the passcode again, to confirm it.')}
          </Text>
        </>
      )
    }

    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <Title style={textStyles.center}>{t('Create passcode')}</Title>
          <Text type="small" style={spacings.mbSm}>
            {t('Choose a passcode to protect your app.')}
          </Text>
        </>
      )
    }

    return (
      <>
        <Title style={textStyles.center}>{t('Change your passcode')}</Title>
        <Text type="small" style={spacings.mbSm}>
          {t('Please enter a new passcode.')}
        </Text>
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        {renderContent()}
        {passcodeConfirmFailed && (
          <Text type="small" appearance="danger" style={spacings.mbSm}>
            {t("Passcodes don't match!")}
          </Text>
        )}
        {step === STEPS.NEW_PASSCODE && <CodeInput autoFocus onFulfill={handleOnFulfillStep1} />}
        {step === STEPS.CONFIRM_NEW_PASSCODE && (
          <CodeInput autoFocus onFulfill={handleOnFulfillStep2} />
        )}
        {state !== PASSCODE_STATES.NO_PASSCODE && (
          <>
            <Text type="small" style={[textStyles.center, spacings.mtTy, spacings.mbLg]}>
              {t('– or –')}
            </Text>
            <Button type="secondary" text={t('Remove passcode')} onPress={handleOnRemovePasscode} />
          </>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ChangePasscodeScreen
