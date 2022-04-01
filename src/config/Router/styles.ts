import { StyleSheet, ViewStyle } from 'react-native'

import { TAB_BAR_HEIGHT } from '@modules/common/constants/router'
import { colorPalette as colors } from '@modules/common/styles/colors'

interface Style {
  tabBarContainer: ViewStyle
  backdropBlurWrapper: ViewStyle
}

export const tabBarStyle = {
  backgroundColor: 'transparent',
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
  paddingTop: 5,
  // Button background should hover the tab bar too
  marginTop: -1
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
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    overflow: 'hidden',
    flex: 1,
    width: '100%',
    maxHeight: TAB_BAR_HEIGHT,
    position: 'absolute',
    bottom: 0
  },
  backdropBlurWrapper: {
    width: '100%',
    height: TAB_BAR_HEIGHT,
    backgroundColor: colors.valhalla_80,
    overflow: 'hidden'
  }
})

export default styles
