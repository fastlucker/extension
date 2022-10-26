import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'

interface Styles {
  shadowPrimary: ViewStyle
  shadowSecondary: ViewStyle
  borderRadiusPrimary: ViewStyle
  borderRadiusSecondary: ViewStyle
  hidden: ViewStyle
  visibilityHidden: ViewStyle
}

export const BORDER_RADIUS_PRIMARY = 13
export const BORDER_RADIUS_SECONDARY = 2

const commonStyles: Styles = {
  shadowPrimary: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 10,
    elevation: 9
  },
  shadowSecondary: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  borderRadiusPrimary: {
    borderRadius: BORDER_RADIUS_PRIMARY
  },
  borderRadiusSecondary: {
    borderRadius: BORDER_RADIUS_SECONDARY
  },
  hidden: {
    overflow: 'hidden'
  },
  visibilityHidden: {
    opacity: 0
  }
}

export default isWeb ? commonStyles : StyleSheet.create<Styles>(commonStyles)
