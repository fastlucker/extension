import { StyleSheet, ViewProps } from 'react-native'
import { TextPath } from 'react-native-svg'

import colors from '@modules/common/styles/colors'

interface Style {
  chevron: TextPath
  accItemStyle: ViewProps
}

const styles = StyleSheet.create<Styles>({
  accItemStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chevron: { fontSize: 12 }
})

export default styles
