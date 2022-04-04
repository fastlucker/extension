import { StyleSheet } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

const styles = StyleSheet.create({
  addressCopyContainer: {
    flexDirection: 'row',
    ...spacings.ph,
    height: 50,
    alignItems: 'center',
    backgroundColor: colors.howl,
    borderRadius: 13
  },
  qrCodeWrapper: {
    borderRadius: 13,
    overflow: 'hidden'
  },
  supportedNetworksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.valhalla_66,
    padding: 2,
    margin: 1,
    ...commonStyles.borderRadiusSecondary,
    minWidth: 86,
    height: 46
  }
})

export default styles
