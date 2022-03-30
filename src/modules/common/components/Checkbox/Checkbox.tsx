import React from 'react'
import { View } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import RNCheckBox, { CheckBoxProps } from '@react-native-community/checkbox'

import Text from '../Text'
import styles from './styles'

interface Props extends CheckBoxProps {
  label?: string
  bottomSpacing?: number
}

const Checkbox = ({ label, children, ...rest }: Props) => (
  <View style={styles.container}>
    <View style={styles.checkboxWrapper}>
      <RNCheckBox
        style={styles.checkbox}
        tintColor={colors.waikawaGray}
        onFillColor={colors.turquoise}
        onTintColor={colors.turquoise}
        onCheckColor={colors.wooed}
        onAnimationType="fade"
        offAnimationType="fade"
        boxType="square"
        {...rest}
      />
    </View>
    <View style={flexboxStyles.flex1}>{label ? <Text fontSize={12}>{label}</Text> : children}</View>
  </View>
)

export default Checkbox
