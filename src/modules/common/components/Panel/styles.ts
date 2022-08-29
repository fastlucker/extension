import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Styles {
  container: ViewStyle
  innerContainer: ViewStyle
  gradient: any
}

const styles = StyleSheet.create<Styles>({
  container: {
    ...spacings.mb,
    flexGrow: 0,
  },
  innerContainer: {
    borderRadius: 13,
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    borderRadius: 13,
  },
})

export default styles
