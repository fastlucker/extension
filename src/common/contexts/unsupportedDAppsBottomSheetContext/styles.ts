import { ImageProps, StyleSheet } from 'react-native'

import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Styles {
  itemIcon: ImageProps
}

const styles = StyleSheet.create<Styles>({
  itemIcon: {
    width: 34,
    height: 34,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.mrTy
  }
})

export default styles
