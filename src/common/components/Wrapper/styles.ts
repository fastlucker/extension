import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { isWeb } from '@config/env'

interface Style {
  wrapper: ViewStyle
  contentContainerStyle: ViewStyle
}

const styles = () =>
  StyleSheet.create<Style>({
    wrapper: {
      flex: 1,
      backgroundColor: 'transparent'
    },
    contentContainerStyle: {
      ...spacings.pbSm,
      flexGrow: 1,
      ...(isWeb ? spacings.ptSm : {}),
      ...(isWeb ? spacings.phLg : {})
    }
  })

export default styles
