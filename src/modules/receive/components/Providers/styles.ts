import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'
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
  disabled: {
    opacity: 0.5
  },
  descriptiveTextSpacing: {
    marginBottom: 3
  }
})

export default styles
