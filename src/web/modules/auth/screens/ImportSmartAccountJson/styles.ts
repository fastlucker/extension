import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  dropAreaContainer: ViewStyle
  dropArea: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    dropAreaContainer: {
      width: '100%',
      height: '100%',
      ...flexbox.justifySpaceBetween,
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.ph,
      ...spacings.pv,
      ...common.shadowPrimary,
      borderWidth: 1,
      borderColor: theme.featureBackground,
      // @ts-ignore
      cursor: 'pointer',
      ...spacings.mbMd
    },
    dropArea: {
      borderRadius: BORDER_RADIUS_PRIMARY,
      width: '100%',
      height: 186,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'space-between',
      ...spacings.ptLg,
      ...spacings.pb
    }
  })

export default getStyles
