import React from 'react'
import { View, ViewStyle } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import Text from '@modules/common/components/Text'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

type Appearances = 'danger' | 'info'

interface Props {
  appearance?: Appearances
  style?: ViewStyle
}

const appearanceColors: { [key in Appearances]: string } = {
  danger: colors.pink,
  info: colors.titan
}

const appearanceText: { [key in Appearances]: any } = {
  danger: 'danger',
  info: undefined
}

const TextWarning: React.FC<Props> = ({
  appearance = 'danger',
  style = spacings.mbLg,
  children
}) => (
  <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, style]}>
    <InfoIcon color={appearanceColors[appearance]} width={24} height={24} style={spacings.mrTy} />
    <Text type="small" appearance={appearanceText[appearance]} style={flexboxStyles.flex1}>
      {children}
    </Text>
  </View>
)

export default TextWarning
