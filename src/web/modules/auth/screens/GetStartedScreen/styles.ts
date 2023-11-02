import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_MD } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  hr: ViewStyle
  logo: ViewStyle
  separatorHorizontal: ViewStyle
  showMoreOptionsButtonContainer: ViewStyle
  showMoreOptionsButton: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    hr: {
      marginVertical: SPACING_MD * 2,
      height: 1,
      width: 500,
      backgroundColor: colors.scampi_20
    },
    logo: {
      position: 'absolute',
      bottom: 27,
      right: '50%',
      marginRight: -(SPACING_MD * 2),
      zIndex: 10
    },
    separatorHorizontal: {
      position: 'absolute',
      width: '100%',
      height: 1,
      backgroundColor: theme.secondaryBorder
    },
    showMoreOptionsButtonContainer: {
      backgroundColor: theme.secondaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
      ...spacings.pbTy,
      ...spacings.ptSm,
      ...spacings.mbMd,
      width: '100%'
    },
    showMoreOptionsButton: {
      backgroundColor: theme.secondaryBackground,
      ...spacings.ph,
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    }
  })

export default getStyles
