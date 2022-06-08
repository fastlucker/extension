import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  addressCopyContainer: ViewStyle
  qrCodeWrapper: ViewStyle
  supportedNetworksContainer: ViewStyle
  supportedNetworksItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // So that, ideally, 4 network items fit on a row (if their name is not huge)
    marginHorizontal: -1
  },
  supportedNetworksItem: {
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
