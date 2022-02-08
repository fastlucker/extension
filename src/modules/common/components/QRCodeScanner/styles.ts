import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.backgroundColor
  },
  camera: {
    height: '100%',
    aspectRatio: 9 / 16
  }
})

export default styles
