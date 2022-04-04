import { StyleSheet } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

const styles = StyleSheet.create({
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...spacings.phSm,
    ...spacings.pvSm,
    ...spacings.mb,
    backgroundColor: colors.clay,
    ...commonStyles.borderRadiusPrimary,
    ...commonStyles.shadowPrimary
  },
  descriptiveTextSpacing: {
    marginBottom: 3
  }
})

export default styles
