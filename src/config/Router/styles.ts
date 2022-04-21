import { StyleSheet, ViewStyle } from 'react-native'

import { isiOS } from '@config/env'
import { TAB_BAR_HEIGHT } from '@modules/common/constants/router'
import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import { colorPalette as colors } from '@modules/common/styles/colors'
import { IS_SCREEN_SIZE_L } from '@modules/common/styles/spacings'

interface Style {
  tabBarContainer: ViewStyle
  backdropBlurWrapper: ViewStyle
}

const tabBarContainerBackground = !isiOS ? { backgroundColor: colors.valhalla } : {}
const tabBarBackground = isiOS ? { backgroundColor: 'transparent' } : {}

export const drawerStyle = {
  backgroundColor: colors.clay,
  borderTopRightRadius: 13,
  borderBottomRightRadius: 13,
  width: 282
}

export const headerStyle = {
  backgroundColor: 'transparent'
}

export const headerTitleStyle = {
  fontSize: 18,
  fontFamily: FONT_FAMILIES.REGULAR
}

export const tabBarStyle = {
  ...tabBarBackground,
  borderColor: colors.waikawaGray,
  borderWidth: 1,
  // border top width and color should be specified separately
  borderTopColor: colors.waikawaGray,
  borderTopWidth: 1,
  borderBottomWidth: 0,
  height: TAB_BAR_HEIGHT,
  borderTopLeftRadius: 13,
  borderTopRightRadius: 13,
  paddingHorizontal: 10
}

export const tabBarItemStyle = {
  paddingTop: 8,
  paddingBottom: 12
}

export const landscapeTabBarLabelStyle = {
  fontSize: 16,
  paddingLeft: IS_SCREEN_SIZE_L ? 10 : 0
}

export const tabBarLabelStyle = {
  fontSize: 9
}

export const navigationContainerDarkTheme = {
  dark: true,
  colors: {
    primary: colors.clay,
    background: colors.clay,
    card: colors.clay,
    text: colors.titan,
    border: 'transparent',
    notification: colors.clay
  }
}

const styles = StyleSheet.create<Style>({
  tabBarContainer: {
    ...tabBarContainerBackground,
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  backdropBlurWrapper: {
    width: '100%',
    backgroundColor: colors.patriotBlue_75,
    overflow: 'hidden'
  }
})

export default styles
