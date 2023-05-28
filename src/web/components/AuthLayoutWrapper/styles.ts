import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  mainContentWrapper: ViewStyle
  sideContentContainer: ViewStyle
  informationCircle: ViewStyle
  amebaAlpha: ViewStyle
  amebaBeta: ViewStyle
}

const styles = StyleSheet.create<Style>({
  mainContentWrapper: {
    width: 315,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1
  },
  sideContentContainer: {
    width: '35%',
    paddingTop: 30,
    paddingHorizontal: 80,
    overflow: 'hidden'
  },
  informationCircle: {
    alignSelf: 'center',
    paddingBottom: 30
  },
  amebaAlpha: {
    position: 'absolute',
    right: '50%',
    bottom: -910,
    marginRight: -825,
    zIndex: -1
  },
  amebaBeta: {
    position: 'absolute',
    right: '50%',
    bottom: -1050,
    marginRight: -825,
    zIndex: -1
  }
})

export default styles
