import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_XL } from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  content: ViewStyle
  contentInner: ViewStyle
  icon: ViewStyle
  title: TextStyle
  action: ViewStyle
}

const isTab = getUiType().isTab

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...flexbox.alignCenter,
    ...spacings.pr,
    ...spacings.mbSm,
    backgroundColor: colors.lightViolet,
    borderRadius: 12,
    overflow: 'hidden',
    ...commonStyles.shadowSecondary,
    shadowColor: colors.lightViolet,
    shadowOffset: {
      width: 5,
      height: 7
    }
  },
  content: {
    ...flexbox.directionRow,
    ...flexbox.flex1,
    ...flexbox.alignCenter,
    ...spacings.plMi,
    borderLeftColor: colors.violet,
    borderLeftWidth: 9,
    minHeight: 65
  },
  contentInner: {
    ...spacings.mlTy
  },
  icon: {
    ...flexbox.center,
    width: SPACING_XL,
    height: SPACING_XL,
    borderRadius: 12,
    backgroundColor: colors.violet
  },
  title: { lineHeight: isTab ? 25 : 20 },
  action: {
    ...spacings.mlLg
  }
})

export default styles
