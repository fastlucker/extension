import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { SPACING_SM } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  showQueueButton: ViewStyle
  textarea: ViewStyle
  buttonsContainer: ViewStyle
  buttonWrapper: ViewStyle
  permissionLabelWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  showQueueButton: {
    position: 'absolute',
    right: SPACING_SM,
    top: SPACING_SM,
    borderRadius: 50,
    padding: 3,
    backgroundColor: colors.wooed
  },
  textarea: {
    minHeight: 120,
    flex: 1,
    backgroundColor: colors.mirage,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.ph,
    ...spacings.pv,
    ...spacings.mbMd
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: -5,
    ...spacings.mbTy
  },
  buttonWrapper: {
    marginHorizontal: 5,
    flex: 1
  },
  permissionLabelWrapper: {
    ...spacings.pvSm,
    ...spacings.phSm,
    ...commonStyles.borderRadiusPrimary,
    backgroundColor: colors.clay
  }
})

export default styles
