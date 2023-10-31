import React from 'react'
import { ViewStyle } from 'react-native'

import Text from '@common/components/Text'
import FeeWrapper from '@web/modules/sign-account-op/components/FeeWrapper'
import styles from './styles'

interface Props {
  label: string
  type: string
  amount: string
  onPress: (fee: string) => void
  style?: ViewStyle
  isSelected: boolean
}

const Fee = ({ label, type, amount, onPress, style, isSelected }: Props) => (
  <FeeWrapper onPress={onPress} style={style} type={type} isSelected={isSelected}>
    <Text fontSize={16} weight="medium" style={styles.label}>
      {label}
    </Text>
    <Text fontSize={14} numberOfLines={1}>
      {amount}
    </Text>
  </FeeWrapper>
)

export default Fee
