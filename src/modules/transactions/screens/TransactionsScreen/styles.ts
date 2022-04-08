import { StyleSheet } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { DEVICE_WIDTH } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

const styles = StyleSheet.create({
  // sectionTitleWrapper: {
  //   backgroundColor: colors.valhalla,
  //   ...commonStyles.shadowSecondary,
  //   ...spacings.phSm,
  //   ...spacings.pvTy,
  //   width: DEVICE_WIDTH - 70,
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   zIndex: 3,
  //   borderRadius: 13,
  //   marginBottom: 10
  // }
  sectionTitleWrapper: {
    backgroundColor: colors.valhalla,
    ...commonStyles.shadowSecondary,
    ...spacings.phSm,
    ...spacings.pvTy,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    marginBottom: 10
  }
})

export default styles
