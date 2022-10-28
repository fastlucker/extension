import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import CheckIcon from '@assets/svg/CheckIcon'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

interface Props {
  label?: string
  onValueChange: (value: boolean) => void
  value: boolean
  children: any
}

const Checkbox = ({ label, children, onValueChange, value }: Props) => {
  const onChange = () => {
    !!onValueChange && onValueChange(!value)
  }
  return (
    <View style={styles.container}>
      <View style={styles.checkboxWrapper}>
        <TouchableOpacity
          style={[styles.webCheckbox, !!value && { backgroundColor: colors.turquoise }]}
          onPress={onChange}
          activeOpacity={0.6}
        >
          {!!value && <CheckIcon />}
        </TouchableOpacity>
      </View>
      <View style={flexboxStyles.flex1}>
        {label ? (
          <Text onPress={onChange} fontSize={12}>
            {label}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  )
}

export default Checkbox
