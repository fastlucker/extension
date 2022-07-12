import { StyleSheet, ViewProps } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { SPACING_MD } from '@modules/common/styles/spacings'

interface Styles {
  networksContainer: ViewProps
  networkBtnContainer: ViewProps
  networkBtnContainerActive: ViewProps
  networkBtnIcon: ViewProps
}

const ICON_WRAPPER_SIZE = 32
// Active item height is a bit smaller than the item itself
const ACTIVE_ITEM_HEIGHT_GAP = 10
export const SINGLE_ITEM_HEIGHT = 52

const styles = StyleSheet.create<Styles>({
  networksContainer: {
    height: SINGLE_ITEM_HEIGHT * 5,
    ...spacings.mbTy
  },
  networkBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ICON_WRAPPER_SIZE + SPACING_MD,
    ...spacings.prMd,
    ...spacings.pvTy
  },
  networkBtnContainerActive: {
    borderRadius: 13,
    backgroundColor: colors.howl,
    position: 'absolute',
    width: '100%',
    top: SINGLE_ITEM_HEIGHT * 2 + ACTIVE_ITEM_HEIGHT_GAP / 2,
    left: 0,
    height: SINGLE_ITEM_HEIGHT - ACTIVE_ITEM_HEIGHT_GAP
  },
  networkBtnIcon: {
    width: ICON_WRAPPER_SIZE,
    height: ICON_WRAPPER_SIZE,
    backgroundColor: colors.valhalla,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
