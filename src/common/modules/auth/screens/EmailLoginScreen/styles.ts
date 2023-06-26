import { StyleSheet } from 'react-native'

import spacings, { SPACING } from '@common/styles/spacings'

const styles = StyleSheet.create({
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    ...spacings.pt,
    paddingBottom: SPACING * 2
  }
})

export default styles
