import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { SPACING } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  emptyStateItem: ViewStyle
  itemsContainer: ViewStyle
  item: ViewStyle
}

const styles = StyleSheet.create<Style>({
  emptyStateItem: {
    borderWidth: 1,
    ...commonStyles.borderRadiusPrimary,
    borderColor: colors.waikawaGray,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.howl,
    minHeight: 126
  },
  itemsContainer: {
    marginHorizontal: -10
  },
  item: {
    ...spacings.mhTy
  }
})

export default styles
