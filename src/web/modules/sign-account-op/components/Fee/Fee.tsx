import React from 'react'
import { ViewStyle } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import FeeWrapper from '@web/modules/sign-account-op/components/FeeWrapper'

interface Props {
  label: string
  type: string
  amount: string
  onPress: (fee: string) => void
  style?: ViewStyle
  isSelected: boolean
}

const Fee = ({ label, type, amount, onPress, style, isSelected }: Props) => {
  const { theme } = useTheme()
  return (
    <FeeWrapper onPress={onPress} style={style} type={type} isSelected={isSelected}>
      <Text
        weight="medium"
        fontSize={14}
        style={spacings.mbMi}
        color={isSelected ? theme.primary : theme.primaryText}
      >
        {label}
      </Text>
      <Text
        fontSize={14}
        numberOfLines={1}
        weight="medium"
        color={isSelected ? theme.primary : theme.primaryText}
      >
        {amount}
      </Text>
    </FeeWrapper>
  )
}

export default Fee
