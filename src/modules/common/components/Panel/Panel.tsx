import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View, ViewProps } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type PanelTypes = 'filled' | 'gradient'
interface Props extends ViewProps {
  type?: PanelTypes
  horizontalSpacing?: 'small' | 'tiny' | 'micro'
  contentContainerStyle?: any
}

const Panel: React.FC<Props> = ({
  children,
  style,
  type = 'gradient',
  horizontalSpacing = 'small',
  contentContainerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {type === 'gradient' && (
        <LinearGradient
          style={[styles.gradient, style]}
          colors={[colors.valhalla, 'transparent']}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      )}
      <View
        style={[
          styles.innerContainer,
          spacings.pvSm,
          type === 'filled' && { backgroundColor: colors.clay },
          horizontalSpacing === 'small' && spacings.phSm,
          horizontalSpacing === 'tiny' && spacings.phTy,
          horizontalSpacing === 'micro' && spacings.phMi,
          contentContainerStyle
        ]}
      >
        {children}
      </View>
    </View>
  )
}

export default Panel
