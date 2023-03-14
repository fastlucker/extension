import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Styles {
  container: ViewStyle
  innerContainer: ViewStyle
  gradient: any
}

const styles = StyleSheet.create<Styles>({
  container: {
    ...spacings.mb
  },
  innerContainer: {
    borderRadius: 13,
    flex: 1
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    borderRadius: 13
  }
})

export default styles
