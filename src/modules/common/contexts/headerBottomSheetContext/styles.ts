import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  separator: ViewProps
}

const styles = StyleSheet.create<Styles>({
  separator: {
    height: 1,
    borderBottomWidth: 1,
    borderColor: colors.waikawaGray
  }
})

export default styles
