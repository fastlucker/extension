import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginLeft: 'auto',
    marginRight: 'auto',
    ...spacings.pv,
    ...spacings.mvLg
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: colors.textColor,
    borderBottomWidth: 1,
    ...spacings.mhMi
  },
  cellText: {
    color: colors.textColor,
    fontSize: 25,
    textAlign: 'center'
  },
  focusCell: {
    borderBottomColor: colors.primaryAccentColor,
    borderBottomWidth: 1
  }
})

export default styles
