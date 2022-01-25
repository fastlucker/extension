import React from 'react'
import RnCodeInput from 'react-native-confirmation-code-input'

import colors from '@modules/common/styles/colors'

const CodeInput: React.FC<RnCodeInput['props']> = (props) => {
  return (
    <RnCodeInput
      secureTextEntry
      keyboardType="numeric"
      className="border-b"
      space={10}
      codeLength={6}
      activeColor={colors.primaryAccentColor}
      size={30}
      inputPosition="left"
      {...props}
    />
  )
}

export default CodeInput
