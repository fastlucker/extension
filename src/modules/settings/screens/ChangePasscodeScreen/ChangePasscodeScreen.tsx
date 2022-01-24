import React, { useState } from 'react'
import { Vibration } from 'react-native'

import { useTranslation } from '@config/localization'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

interface Props {
  passcode: string
}

const ChangePasscodeScreen: React.FC<Props> = ({ passcode }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [hasValidPasscode, setHasValidPasscode] = useState<null | boolean>(null)

  const handleOnValidate = (code: string) => {
    const isValid = code === passcode
    setHasValidPasscode(isValid)

    if (!isValid) return Vibration.vibrate()

    navigation.navigate('passcode-create')
  }

  const hasError = !hasValidPasscode && hasValidPasscode !== null

  return (
    <Wrapper>
      <Title>{t('Enter current passcode first')}</Title>
      {hasError && <P type={TEXT_TYPES.DANGER}>{t('Wrong passcode.')}</P>}
      <CodeInput onFulfill={handleOnValidate} />
    </Wrapper>
  )
}

export default ChangePasscodeScreen
