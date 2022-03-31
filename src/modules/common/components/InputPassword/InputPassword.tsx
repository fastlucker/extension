import React, { useState } from 'react'

import InvisibilityIcon from '@assets/svg/InvisibilityIcon'
import VisibilityIcon from '@assets/svg/VisibilityIcon'
import Input, { InputProps } from '@modules/common/components/Input'

interface Props extends InputProps {}

const InputPassword: React.FC<Props> = ({ onChangeText, ...rest }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleToggleSecureTextEntry = () => setSecureTextEntry(!secureTextEntry)

  return (
    <Input
      secureTextEntry={secureTextEntry}
      autoCorrect={false}
      buttonText={secureTextEntry ? <VisibilityIcon /> : <InvisibilityIcon />}
      onButtonPress={handleToggleSecureTextEntry}
      onChangeText={onChangeText}
      {...rest}
    />
  )
}

export default InputPassword
