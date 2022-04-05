import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

import { ThemeContext } from '@modules/common/contexts/themeContext'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props {
  children: any
  gradient?: string[]
}

const GradientBackgroundWrapper = ({ children, gradient }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }: any) => (
      <LinearGradient
        colors={gradient || theme?.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={flexboxStyles.flex1}
      >
        {children}
      </LinearGradient>
    )}
  </ThemeContext.Consumer>
)

export default GradientBackgroundWrapper
