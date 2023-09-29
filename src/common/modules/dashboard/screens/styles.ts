import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  container: ViewStyle
  contentContainer: ViewStyle
  overview: ViewStyle
  banners: ViewStyle
}

const styles = StyleSheet.create<Style>({
  contentContainer: commonWebStyles.contentContainer,
  container: {
    ...flexbox.flex1,
    ...spacings.pt,
    backgroundColor: colors.white
  },
  overview: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...spacings.mb
  },
  banners: spacings.mb
})

export default styles
