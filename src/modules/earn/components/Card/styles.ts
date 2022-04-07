import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { SPACING_SM } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Style {
  backButton: ViewStyle
  detailsItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  backButton: {
    position: 'absolute',
    top: SPACING_SM,
    left: 0,
    zIndex: 5
  },
  detailsItem: {
    ...spacings.pvTy,
    ...flexboxStyles.directionRow,
    borderColor: 'red',
    borderBottomColor: colors.waikawaGray,
    borderBottomWidth: 1
  }
})

export default styles
