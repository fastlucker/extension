import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import Text from '@modules/common/components/Text'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
  isActive?: boolean
}

const ButtonSegment: React.FC<Props> = ({ text, style = {}, isActive = false, ...rest }) => (
  <TouchableOpacity
    disabled={isActive}
    style={[styles.buttonContainer, isActive && styles.active, style]}
    {...rest}
  >
    <Text style={[styles.buttonText, isActive && textStyles.bold]}>{text}</Text>
  </TouchableOpacity>
)

export default ButtonSegment
