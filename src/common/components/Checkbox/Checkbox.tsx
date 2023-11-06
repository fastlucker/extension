import React, { ReactNode } from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'
import { StrategiesMetadata } from '@yfi/sdk'

interface Props {
  label?: ReactNode
  onValueChange: (value: boolean) => void
  value: boolean
  children?: any
  style?: ViewProps['style']
  isDisabled?: boolean
  TestId?: string
}

const Checkbox = ({ label, children, onValueChange, value, style, isDisabled }: Props) => {
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
              borderColor: value ? colors.greenHaze : colors.martinique
            },
            !!value && { backgroundColor: colors.greenHaze }
          ]}
          onPress={onChange}
          activeOpacity={0.6}
          disabled={isDisabled}
        >
          {!!value && <CheckIcon />}
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
