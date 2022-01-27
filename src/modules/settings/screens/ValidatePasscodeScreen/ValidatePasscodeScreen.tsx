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
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

interface Props extends NativeStackScreenProps<any> {}

const ValidatePasscodeScreen: React.FC<Props> = ({ route }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    isValidPasscode,
    isLoading,
    isValidLocalAuth,
    state,
    deviceSupportedAuthTypesLabel,
    fallbackSupportedAuthTypesLabel
  } = usePasscode()
  const [hasValidPasscode, setHasValidPasscode] = useState<null | boolean>(null)

  const handleOnValidateLocalAuth = async () => {
    const isValid = await isValidLocalAuth()

    if (isValid) {
      navigation.navigate(route.params?.redirectRoute)
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
      navigation.navigate(route.params?.redirectRoute)
    }
  }

  const hasError = !hasValidPasscode && hasValidPasscode !== null

  if (isLoading) return null

  return (
    <Wrapper>
      <P style={[textStyles.center, spacings.mtLg]}>
        {t('In order to proceed, please authenticate by entering the app passcode.')}
      </P>
      {hasError && (
        <P type={TEXT_TYPES.DANGER} style={[textStyles.center, spacings.mb0]}>
          {t('Wrong passcode.')}
        </P>
      )}
      <CodeInput
        autoFocus={state === PASSCODE_STATES.PASSCODE_ONLY}
        onFulfill={handleOnValidatePasscode}
      />
      {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH && (
        <>
          <Text style={[textStyles.center, spacings.mtTy, spacings.mbLg]}>{t('– or –')}</Text>
          <P style={textStyles.center}>
            {deviceSupportedAuthTypesLabel
              ? t(
                  'Authenticate with {{deviceSupportedAuthTypesLabel}} or your phone {{fallbackSupportedAuthTypesLabel}}.',
                  {
                    deviceSupportedAuthTypesLabel,
                    fallbackSupportedAuthTypesLabel
                  }
                )
              : t('Authenticate with your phone {{fallbackSupportedAuthTypesLabel}}.', {
                  fallbackSupportedAuthTypesLabel
                })}
          </P>
          <Button text={t('Authenticate')} onPress={handleOnValidateLocalAuth} />
        </>
      )}
    </Wrapper>
  )
}

export default ValidatePasscodeScreen
