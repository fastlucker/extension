import React from 'react'
import { View, ViewStyle } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

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
