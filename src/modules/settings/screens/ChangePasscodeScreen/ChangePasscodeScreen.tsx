import React, { useState } from 'react'

import { useTranslation } from '@config/localization'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import usePasscode from '@modules/common/hooks/usePasscode'
import { useNavigation } from '@react-navigation/native'

interface Props {
  passcode: string
}

const ChangePasscodeScreen: React.FC<Props> = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { isValidPasscode } = usePasscode()
  const [hasValidPasscode, setHasValidPasscode] = useState<null | boolean>(null)

  const handleOnValidate = (code: string) => {
    const isValid = isValidPasscode(code)
    setHasValidPasscode(isValid)

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
