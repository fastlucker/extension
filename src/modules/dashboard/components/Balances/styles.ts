import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  otherBalancesTextHighlight: TextStyle
  activityIndicator: ViewStyle
  otherBalancesContainer: ViewStyle
  button: ViewStyle
  buttonIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  button: {
    minWidth: 100,
    alignItems: 'flex-end',
    ...spacings.mhMi,
    ...spacings.ph0
  },
  buttonIcon: {
    marginRight: 3
  },
  activityIndicator: {
    marginBottom: 15,
    marginLeft: 15
  },
  otherBalancesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.8
  },
  otherBalancesTextHighlight: {
    fontWeight: '500'
  }
})

export default styles
