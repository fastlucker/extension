import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING } from '@common/styles/spacings'

interface Style {
  logoWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  logoWrapper: {
    alignItems: 'center',
    ...spacings.pt,
    paddingBottom: SPACING * 2
  }
})

export default styles
