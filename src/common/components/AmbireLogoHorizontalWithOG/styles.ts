import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  pressable: ViewStyle
  confettiContainer: ViewStyle
}

export const CONFETTI_WIDTH = 200
export const CONFETTI_HEIGHT = 150

const styles = StyleSheet.create<Style>({
  pressable: {
    // @ts-ignore prop (not in types, but it works) make it less obvious that this is a pressable
    cursor: 'default'
  },
  confettiContainer: {
    zIndex: -1,
    position: 'absolute',
    top: -30,
    right: -25,
    width: CONFETTI_WIDTH,
    height: CONFETTI_HEIGHT
  }
})

export default styles
