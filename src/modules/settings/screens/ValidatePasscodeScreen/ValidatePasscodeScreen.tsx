import React, { useEffect, useState } from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext'
import usePasscode from '@modules/common/hooks/usePasscode'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

interface Props {
  passcode: string
}

const ValidatePasscodeScreen: React.FC<Props> = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { isValidPasscode, isLoading, isValidLocalAuth, state, deviceSupportedAuthTypesLabel } =
    usePasscode()
  const [hasValidPasscode, setHasValidPasscode] = useState<null | boolean>(null)

  const handleOnValidateLocalAuth = async () => {
    const isValid = await isValidLocalAuth()

    if (isValid) {
      navigation.navigate('passcode-change')
    }
  }

  useEffect(() => {
    if (state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH) {
      handleOnValidateLocalAuth()
    }
  }, [state])

  const handleOnValidatePasscode = (code: string) => {
    const isValid = isValidPasscode(code)
    setHasValidPasscode(isValid)

    if (isValid) {
      navigation.navigate('passcode-change')
    }
  }

  const hasError = !hasValidPasscode && hasValidPasscode !== null

  if (isLoading) return null

  return (
    <Wrapper>
      <Title>{t('Current passcode')}</Title>
      <P>{t('In order to change or remove passcode, enter the current passcode first.')}</P>
      {hasError && <P type={TEXT_TYPES.DANGER}>{t('Wrong passcode.')}</P>}
      <CodeInput
        focusable={state === PASSCODE_STATES.PASSCODE_ONLY}
        onFulfill={handleOnValidatePasscode}
      />
      {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH && (
        <>
          <Text style={[textStyles.center, spacings.mv]}>{t('– or –')}</Text>
          <P>
            {t('Authenticate with your device {{ deviceSupportedAuthTypesLabel }}.', {
              deviceSupportedAuthTypesLabel
            })}
          </P>
          <Button text={t('Authenticate')} onPress={handleOnValidateLocalAuth} />
        </>
      )}
    </Wrapper>
  )
}

export default ValidatePasscodeScreen
