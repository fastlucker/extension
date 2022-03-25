import { StyleSheet } from 'react-native'

import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  separator: {
    fontSize: 20,
    ...spacings.pvLg
  }
})

export default styles
