import { ImageProps, StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { SPACING } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  emptyStateItem: ViewStyle
  itemsContainer: ViewStyle
  itemWrapper: ViewStyle
  item: ViewStyle
  collectibleImage: ImageProps
  collectionImage: ImageProps
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
    minHeight: 126,
    ...spacings.mhTy
  },
  itemsContainer: {
    marginHorizontal: -10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1
  },
  itemWrapper: {
    width: '50%',
    ...spacings.phTy,
    ...spacings.pbSm
  },
  item: {
    ...commonStyles.borderRadiusPrimary,
    ...commonStyles.hidden,
    backgroundColor: colors.howl
  },
  collectibleImage: {
    width: '100%',
    height: 126,
    ...spacings.mbMi
  },
  collectionImage: {
    width: 15,
    height: 15,
    borderRadius: 50,
    ...spacings.mrMi
  }
})

export default styles
