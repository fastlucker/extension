import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  logoWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  logoWrapper: {
    alignItems: 'center',
    ...spacings.pt,
    paddingBottom: 40
  }
})

export default styles
