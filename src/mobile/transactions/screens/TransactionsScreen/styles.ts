import { StyleSheet } from 'react-native'

import { isWeb } from '@common/config/env'
import spacings from '@common/styles/spacings'

const styles = StyleSheet.create({
  sectionViewWrapper: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    overflow: 'hidden',
    ...(isWeb ? spacings.mhLg : spacings.mh),
    flex: 1
  }
})

export default styles
