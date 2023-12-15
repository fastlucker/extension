import { FC } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface StepProps {
  label: string
  value: string
  isValueSmall?: boolean
}

const StepRow: FC<StepProps> = ({ label, value, isValueSmall }) => (
  <View
    style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween, spacings.mbTy]}
    key={label}
  >
    <Text appearance="secondaryText" fontSize={14}>
      {label}
    </Text>
    <Text appearance="secondaryText" fontSize={!isValueSmall ? 14 : 12}>
      {value}
    </Text>
  </View>
)

export default StepRow
