import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  container: ViewStyle
  contentContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  contentContainer: {
    ...spacings.pv0,
    ...spacings.ph0,
    ...flexbox.flex1,
    ...commonWebStyles.contentContainer
  },
  container: {
    backgroundColor: colors.white
  }
})

export default styles
