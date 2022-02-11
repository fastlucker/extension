import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  detailsPlaceholderContainer: ViewStyle
  detailsPlaceholder: ViewStyle
}

const styles = StyleSheet.create<Style>({
  detailsPlaceholderContainer: {
    ...spacings.mbLg,
    opacity: 0.5
  },
  detailsPlaceholder: {
    flex: 1,
    height: 18,
    backgroundColor: '#FFF',
    opacity: 0.1,
    ...spacings.mbMi
  }
})

export default styles
