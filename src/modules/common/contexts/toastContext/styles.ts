import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  container: ViewStyle
  toast: ViewStyle
  error: ViewStyle
  text: TextStyle
  rightIcon: ViewStyle
  closeIcon: ViewStyle
  badgeWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    position: 'absolute',
    bottom: 80,
    width: Dimensions.get('window').width,
    zIndex: 10000
  },
  toast: {
    backgroundColor: colors.primaryAccentColor,
    borderLeftWidth: 0,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    height: 'auto',
    width: Dimensions.get('window').width,
    marginBottom: 5,
    borderRadius: 2,
    flex: 1
  },
  error: {
    backgroundColor: colors.dangerColor
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryButtonColor,
    flex: 1
  },
  rightIcon: {
    paddingRight: 10
  },
  closeIcon: {
    paddingLeft: 10
  },
  badgeWrapper: {
    paddingRight: 10
  }
})

export default styles
