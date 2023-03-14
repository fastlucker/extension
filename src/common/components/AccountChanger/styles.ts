import { StyleSheet, ViewProps } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

interface Styles {
  accountContainerActive: ViewProps
  activeBlockieStyle: ViewProps
}

const styles = StyleSheet.create<Styles>({
  accountContainerActive: {
    backgroundColor: colors.howl,
    borderRadius: 13
  },
  activeBlockieStyle: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.lightViolet
  }
})

export default styles
