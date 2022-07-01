import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  loadingContainer: ViewStyle
  otherBalancesContainer: ViewStyle
  button: ViewStyle
  buttonIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  button: {
    minWidth: 100,
    alignItems: 'flex-end',
    backgroundColor: colors.martinique,
    ...spacings.mhMi,
    ...spacings.ph0
  },
  buttonIcon: {
    marginRight: 3
  },
  loadingContainer: {
    // Reserves some initial height, so that it covers the common space,
    // which every user (even with balance 0) will have.
    height: 200
  },
  otherBalancesContainer: {
    flexDirection: 'row',
    width: 275,
    borderBottomColor: colors.waikawaGray,
    borderBottomWidth: 1,
    paddingVertical: 2
  }
})

export default styles
