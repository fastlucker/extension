import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_MI, SPACING_SM } from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  showQueueButton: ViewStyle
  textarea: ViewStyle
  buttonsContainer: ViewStyle
  buttonWrapper: ViewStyle
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
    ...spacings.mbLg
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: -SPACING_MI,
    ...spacings.mbTy
  },
  buttonWrapper: {
    ...spacings.mhMi,
    flex: 1
  }
})

export default styles
