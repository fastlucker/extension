import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

import { ThemeContext } from '@modules/common/contexts/themeContext'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { HeaderHeightContext } from '@react-navigation/elements'

interface Props {
  children: any
  gradient?: string[]
}

const GradientBackgroundWrapper = ({ children, gradient }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }: any) => (
      <HeaderHeightContext.Consumer>
        {(headerHeight) => (
          <LinearGradient
            colors={gradient || theme?.backgroundGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            // TODO: Static paddingTop might work better now. Check out.
            style={[flexboxStyles.flex1, { paddingTop: 100 }]}
          >
            {children}
          </LinearGradient>
        )}
      </HeaderHeightContext.Consumer>
    )}
  </ThemeContext.Consumer>
)

export default GradientBackgroundWrapper
