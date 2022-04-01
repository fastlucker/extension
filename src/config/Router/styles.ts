import { StyleSheet, ViewStyle } from 'react-native'

import { isiOS } from '@config/env'
import { TAB_BAR_HEIGHT } from '@modules/common/constants/router'
import { colorPalette as colors } from '@modules/common/styles/colors'

interface Style {
  tabBarContainer: ViewStyle
  backdropBlurWrapper: ViewStyle
}

const tabBarContainerBackground = !isiOS ? { backgroundColor: colors.valhalla } : {}
const tabBarBackground = isiOS ? { backgroundColor: 'transparent' } : {}

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
  paddingTop: 5
}

export const tabBarLabelStyle = {
  paddingBottom: 12,
  marginTop: -4,
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
