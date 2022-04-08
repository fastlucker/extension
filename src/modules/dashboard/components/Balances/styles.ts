import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  activityIndicator: ViewStyle
  otherBalancesContainer: ViewStyle
  button: ViewStyle
  buttonIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  button: {
    minWidth: 100,
    alignItems: 'flex-end',
    ...spacings.mhMi,
    ...spacings.ph0
  },
  buttonIcon: {
    marginRight: 3
  },
  activityIndicator: {
    marginBottom: 15,
    marginLeft: 15
  },
  otherBalancesContainer: {
    flexDirection: 'row',
    width: 275,
    borderBottomColor: colors.waikawaGray,
    borderBottomWidth: 0.5
  }
})

export default styles
