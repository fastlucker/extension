import React from 'react'
import RnCodeInput from 'react-native-confirmation-code-input'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

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
      containerStyle={[flexboxStyles.center, spacings.mbLg]}
      {...props}
    />
  )
}

export default CodeInput
