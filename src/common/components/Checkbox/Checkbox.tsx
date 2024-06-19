import React, { ReactNode } from 'react'
import { ColorValue, TouchableOpacity, View, ViewProps } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'

interface Props {
  label?: ReactNode
  onValueChange: (value: boolean) => void
  value: boolean
  children?: any
  style?: ViewProps['style']
  uncheckedBorderColor?: ColorValue
  isDisabled?: boolean
  testID?: string
}

const Checkbox = ({
  label,
  children,
  onValueChange,
  value,
  style,
  uncheckedBorderColor,
  isDisabled,
  testID = 'checkbox'
}: Props) => {
  const { theme } = useTheme()
  const onChange = () => {
    !!onValueChange && onValueChange(!value)
  }

  return (
    <View style={[styles.container, style, isDisabled && { opacity: 0.6 }]}>
      <View style={styles.checkboxWrapper}>
        <TouchableOpacity
          style={[
            styles.webCheckbox,
            {
              borderColor: value
                ? theme.successDecorative
                : uncheckedBorderColor || theme.primaryBorder
            },
            !!value && { backgroundColor: theme.successDecorative }
          ]}
          testID={testID}
          onPress={onChange}
          activeOpacity={0.6}
          disabled={isDisabled}
        >
          {!!value && <CheckIcon color={theme.successDecorative} />}
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
