import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import Text from '@modules/common/components/Text'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
  isActive?: boolean
}

const ButtonSegment: React.FC<Props> = ({ text, style = {}, isActive = false, ...rest }) => (
  <TouchableOpacity style={[styles.buttonContainer, style, isActive && styles.active]} {...rest}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
)

export default ButtonSegment
