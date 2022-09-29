import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'
import spacings from '@modules/common/styles/spacings'

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
      ...(isWeb ? spacings.ptSm : {})
    }
  })

export default styles
