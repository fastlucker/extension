import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden'
  },
  camera: {
    height: '100%',
    aspectRatio: 9 / 16
  }
})

export default styles
