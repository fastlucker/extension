import { StyleSheet } from 'react-native'

import { isWeb } from '@common/config/env'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create({
    container: {
      ...common.borderRadiusPrimary,
      ...common.shadowPrimary,
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: theme.primaryBackground,
      zIndex: 11,
      overflow: 'hidden'
    },
    header: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifySpaceBetween,
      ...spacings.ph,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryBorder,
      backgroundColor: theme.secondaryBackground
    },
    searchInput: {
      ...spacings.plTy,
      fontFamily: isWeb ? FONT_FAMILIES.REGULAR : FONT_FAMILIES.LIGHT,
      height: 24,
      color: theme.secondaryText,
      width: 150
    }
  })

export default getStyles
