import { FC } from 'react'
import { View } from 'react-native'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/TransactionProgressScreen/styles'
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
    style={
      IS_MOBILE_UP_BENZIN_BREAKPOINT
        ? [flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween, spacings.mbTy]
        : spacings.mbTy
    }
    key={label}
  >
    <Text appearance="secondaryText" fontSize={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 14 : 12}>
      {label}
      {!IS_MOBILE_UP_BENZIN_BREAKPOINT && ':'}
    </Text>
    <Text
      appearance={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'secondaryText' : 'primaryText'}
      fontSize={!isValueSmall || !IS_MOBILE_UP_BENZIN_BREAKPOINT ? 14 : 12}
    >
      {value}
    </Text>
  </View>
)

export default StepRow
