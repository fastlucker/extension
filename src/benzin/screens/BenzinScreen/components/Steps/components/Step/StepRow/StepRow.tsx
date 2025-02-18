import { FC } from 'react'
import { View } from 'react-native'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import StarsIcon from '@common/assets/svg/StarsIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

export interface StepRowProps {
  label: string
  value: string
  isValueSmall?: boolean
  isErc20Highlight?: boolean
  error?: boolean
}

const StepRow: FC<StepRowProps> = ({ label, value, isValueSmall, isErc20Highlight, error }) => (
  <View
    style={
      IS_MOBILE_UP_BENZIN_BREAKPOINT
        ? [flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween, spacings.mbTy]
        : [spacings.mbTy]
    }
    key={label}
  >
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Text
        appearance={error ? 'errorText' : 'secondaryText'}
        fontSize={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 14 : 12}
      >
        {label}
        {!IS_MOBILE_UP_BENZIN_BREAKPOINT && ':'}
      </Text>
      {isErc20Highlight && (
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            spacings.mlTy,
            spacings.pvMi,
            spacings.phSm,
            {
              backgroundColor: '#6000FF14',
              borderRadius: 20
            }
          ]}
        >
          <StarsIcon width={12} height={12} />
          <Text style={spacings.mlMi} appearance="primary" weight="medium" fontSize={10}>
            Paid with ERC-20
          </Text>
        </View>
      )}
    </View>
    <Text
      appearance={
        error ? 'errorText' : IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'secondaryText' : 'primaryText'
      }
      fontSize={!isValueSmall || !IS_MOBILE_UP_BENZIN_BREAKPOINT ? 14 : 12}
      selectable
    >
      {value === 'loading' ? <Spinner style={{ width: 18, height: 18 }} /> : value}
    </Text>
  </View>
)

export default StepRow
