import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  sideContentContainer: ViewStyle
  ameba: ViewStyle
}

const styles = StyleSheet.create<Style>({
  sideContentContainer: {
    width: '33%',
    paddingTop: 80,
    paddingHorizontal: 60,
    overflow: 'hidden'
  },
  ameba: {
    position: 'absolute',
    bottom: -910,
    right: '50%',
    marginRight: -825,
    zIndex: -1
  }
})

export default styles
