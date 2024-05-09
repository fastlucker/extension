import { StyleSheet, TextStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  container: TextStyle
  line: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    flex: 1,
    marginHorizontal: 10
  }
})

export default styles
