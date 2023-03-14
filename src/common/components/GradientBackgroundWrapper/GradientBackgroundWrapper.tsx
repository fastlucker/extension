import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import React from 'react'

import { ThemeContext } from '@common/contexts/themeContext'
import flexboxStyles from '@common/styles/utils/flexbox'

interface Props {
  children: any
  gradient?: string[]
  style?: LinearGradientProps['style']
}

const GradientBackgroundWrapper = ({ children, gradient, style }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }: any) => (
      <LinearGradient
        colors={gradient || theme?.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[flexboxStyles.flex1, style]}
      >
        {children}
      </LinearGradient>
    )}
  </ThemeContext.Consumer>
)

export default GradientBackgroundWrapper
