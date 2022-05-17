import { StyleSheet } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

const styles = StyleSheet.create({
  sectionTitleWrapper: {
    backgroundColor: colors.valhalla,
    ...commonStyles.shadowSecondary,
    ...spacings.phSm,
    ...spacings.pvSm,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13
  },
  panel: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 13
  }
})

export default styles
