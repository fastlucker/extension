import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  itemsContainer: ViewStyle
  itemWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  itemsContainer: {
    marginHorizontal: -10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1
  },
  itemWrapper: {
    width: '50%',
    ...spacings.phTy,
    ...spacings.pbSm
  }
})

export default styles
