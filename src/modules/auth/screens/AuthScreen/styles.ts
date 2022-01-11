import { StyleSheet } from 'react-native'

import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  separator: {
    fontSize: 20,
    ...spacings.pvLg
  },
  footer: {
    fontSize: 14
  }
})

export default styles
