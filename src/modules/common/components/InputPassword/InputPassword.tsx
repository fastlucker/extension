import React, { useState } from 'react'

import { Feather } from '@expo/vector-icons'
import Input, { InputProps } from '@modules/common/components/Input'
import colors from '@modules/common/styles/colors'

interface Props extends InputProps {}

const InputPassword: React.FC<Props> = ({ onChangeText, ...rest }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleToggleSecureTextEntry = () => setSecureTextEntry(!secureTextEntry)

  return (
    <Input
      secureTextEntry={secureTextEntry}
      autoCorrect={false}
      buttonText={
        <Feather name={secureTextEntry ? 'eye' : 'eye-off'} size={25} color={colors.inputColor} />
      }
      onButtonPress={handleToggleSecureTextEntry}
      onChangeText={onChangeText}
      {...rest}
    />
  )
}

export default InputPassword
