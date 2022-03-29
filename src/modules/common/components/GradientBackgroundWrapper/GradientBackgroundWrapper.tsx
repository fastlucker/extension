import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

import { ThemeContext } from '@modules/common/contexts/themeContext'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { HeaderHeightContext } from '@react-navigation/elements'

const GradientBackgroundWrapper = ({ children }: any) => (
  <ThemeContext.Consumer>
    {({ theme }: any) => (
      <HeaderHeightContext.Consumer>
        {(headerHeight) => (
          <LinearGradient
            colors={theme?.backgroundGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[flexboxStyles.flex1, { paddingTop: headerHeight }]}
          >
            {children}
          </LinearGradient>
        )}
      </HeaderHeightContext.Consumer>
    )}
  </ThemeContext.Consumer>
)

export default GradientBackgroundWrapper
