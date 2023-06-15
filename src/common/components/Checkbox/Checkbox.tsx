import React, { ReactNode } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'

interface Props {
  label?: ReactNode
  onValueChange: (value: boolean) => void
  value: boolean
  children: any
  checkedIconColor?: string
  uncheckedIconColor?: string
  style?: ViewStyle
}

const Checkbox = ({
  label,
  children,
  onValueChange,
  value,
  checkedIconColor,
  uncheckedIconColor,
  style
}: Props) => {
  const onChange = () => {
    !!onValueChange && onValueChange(!value)
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.checkboxWrapper}>
        <TouchableOpacity
          style={[
            styles.webCheckbox,
            !!uncheckedIconColor && {
              borderColor: value ? checkedIconColor && checkedIconColor : uncheckedIconColor
            },
            !!value && { backgroundColor: checkedIconColor || colors.turquoise }
          ]}
          onPress={onChange}
          activeOpacity={0.6}
        >
          {!!value && <CheckIcon color={checkedIconColor} />}
        </TouchableOpacity>
      </View>
      <View style={flexboxStyles.flex1}>
        {label ? (
          <Text shouldScale={false} onPress={onChange} weight="regular" fontSize={12}>
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
