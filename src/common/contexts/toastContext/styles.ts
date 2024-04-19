import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'

interface Style {
  container: ViewStyle
  toastWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
    elevation: 20,
    alignItems: 'center',
    ...spacings.ph
  },
  toastWrapper: {
    maxWidth: TAB_CONTENT_WIDTH,
    width: '100%',
    ...common.borderRadiusPrimary,
    ...spacings.mbTy,
    ...common.shadowSecondary
  }
})

export default styles
