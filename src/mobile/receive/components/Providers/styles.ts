import { StyleSheet } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

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
  },
  providerLoadingWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: colors.clay
  }
})

export default styles
