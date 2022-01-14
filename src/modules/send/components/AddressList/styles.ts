import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  formTitleWrapper: ViewStyle
  addressItem: ViewStyle
  addressDelete: ViewStyle
  addressName: TextStyle
  addressId: TextStyle
}

const styles = StyleSheet.create<Style>({
  formTitleWrapper: {
    alignItems: 'center'
  },
  addressItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    ...spacings.phSm,
    ...spacings.pvSm
  },
  addressName: {
    fontSize: 12,
    opacity: 0.5,
    paddingBottom: 2
  },
  addressId: {
    fontSize: 15
  },
  addressDelete: {
    paddingHorizontal: 5,
    paddingVertical: 5
  }
})

export default styles
