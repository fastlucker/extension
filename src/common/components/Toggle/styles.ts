import { StyleSheet, ViewProps } from 'react-native'

import colors from '@common/styles/colors'

interface Style {
  container: ViewProps
  thumbOnStyle: ViewProps
  thumbOffStyle: ViewProps
  trackOnStyle: ViewProps
  trackOffStyle: ViewProps
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbOnStyle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: colors.heliotrope,
    transform: [{ translateX: 10 }]
  },
  thumbOffStyle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: 'rgb(86, 88, 109)',
    transform: [{ translateX: -4 }]
  },
  trackOnStyle: {
    height: 14,
    width: 34,
    padding: 0,
    backgroundColor: colors.heliotrope_40
  },
  trackOffStyle: {
    height: 14,
    width: 34,
    padding: 0,
    backgroundColor: 'rgb(76, 78, 104)'
  }
})

export default styles
