import React, { useState } from 'react'

import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Input, { InputProps } from '@common/components/Input'

interface Props extends InputProps {}

const InputPassword: React.FC<Props> = ({ onChangeText, ...rest }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleToggleSecureTextEntry = () => setSecureTextEntry(!secureTextEntry)

  return (
    <Input
      secureTextEntry={secureTextEntry}
      autoCorrect={false}
      button={secureTextEntry ? <VisibilityIcon /> : <InvisibilityIcon />}
      onButtonPress={handleToggleSecureTextEntry}
      onChangeText={onChangeText}
      {...rest}
    />
  )
}

export default React.memo(InputPassword)
