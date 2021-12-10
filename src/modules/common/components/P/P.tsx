import React from 'react'
import { TextProps } from 'react-native'

import Text from '@modules/common/components/Text'
import s from './style'

interface Props extends TextProps {}

const P = ({ children, ...rest }: Props) => (
  <Text style={s.text} {...rest}>
    {children}
  </Text>
)

export default P
