import React from 'react'
import { View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import Text from '@modules/common/components/Text'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const TextWarning: React.FC = ({ children }) => (
  <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbLg]}>
    <InfoIcon color={colors.pink} width={24} height={24} style={spacings.mrTy} />
    <Text type="small" appearance="danger" style={flexboxStyles.flex1}>
      {children}
    </Text>
  </View>
)

export default TextWarning
