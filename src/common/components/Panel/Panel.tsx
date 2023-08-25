import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View, ViewProps } from 'react-native'

import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import styles from './styles'

interface Props extends ViewProps {
  horizontalSpacing?: 'small' | 'tiny' | 'micro'
  contentContainerStyle?: any
}

const Panel: React.FC<Props> = ({
  children,
  style,
  horizontalSpacing = 'small',
  contentContainerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <View
        style={[
          styles.innerContainer,
          spacings.pvSm,
          horizontalSpacing === 'small' && (isWeb ? spacings.phLg : spacings.phSm),
          horizontalSpacing === 'tiny' && (isWeb ? spacings.phMd : spacings.phTy),
          horizontalSpacing === 'micro' && (isWeb ? spacings.ph : spacings.phMi),
          contentContainerStyle
        ]}
      >
        {children}
      </View>
    </View>
  )
}

export default Panel
