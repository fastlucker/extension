import { StyleSheet, ViewProps } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  panel: ViewProps
}

const styles = StyleSheet.create<Style>({
  panel: {
    minHeight: 300
  }
})

export default styles
