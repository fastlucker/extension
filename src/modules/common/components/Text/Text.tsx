import React from 'react'
import { Text as RNText, TextProps } from 'react-native'

interface Props extends TextProps {}

const Text = ({ children, ...rest }: Props) => <RNText {...rest}>{children}</RNText>

export default Text
