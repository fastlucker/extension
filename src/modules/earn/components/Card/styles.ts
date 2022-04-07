import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_SM } from '@modules/common/styles/spacings'

interface Style {
  detailsPlaceholderContainer: ViewStyle
  detailsPlaceholder: ViewStyle
  backButton: ViewStyle
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
  },
  backButton: {
    position: 'absolute',
    top: SPACING_SM,
    left: 0,
    zIndex: 5
  }
})

export default styles
