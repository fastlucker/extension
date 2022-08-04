import { ImageProps, StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { SPACING_SM } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  contractAddressWrapper: ViewStyle
  collectibleImageLoadingWrapper: ViewStyle
  collectibleImage: ImageProps
}

const styles = StyleSheet.create<Style>({
  contractAddressWrapper: {
    paddingLeft: 40 + SPACING_SM,
    ...spacings.mbTy
  },
  collectibleImageLoadingWrapper: {
    width: 148,
    height: 148,
    ...spacings.mrSm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: colors.clay
  },
  collectibleImage: {
    width: '100%',
    aspectRatio: 1,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
