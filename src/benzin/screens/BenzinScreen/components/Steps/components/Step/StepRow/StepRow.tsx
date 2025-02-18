import { FC } from 'react'
import { View } from 'react-native'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

export interface StepRowProps {
  label: string
  value: string
  isValueSmall?: boolean
  isErc20Highlight?: boolean
  error?: boolean
}

const StepRow: FC<StepRowProps> = ({ label, value, isValueSmall, isErc20Highlight, error }) => {
  const { theme } = useTheme()

  return (
    <View
      style={[
        ...(IS_MOBILE_UP_BENZIN_BREAKPOINT
          ? [flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween, spacings.mbTy]
          : [spacings.mbTy]),
        isErc20Highlight
          ? {
              shadowColor: theme.primary,
              shadowRadius: 4,
              shadowOpacity: 0.5,
              borderRadius: 4,
              ...spacings.pvMi,
              ...spacings.phTy,
              borderWidth: 1,
              borderColor: theme.primary,
              backgroundColor: theme.secondaryBackground
            }
          : {}
      ]}
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
          <Text appearance="primary" weight="medium" fontSize={12} style={spacings.mlTy}>
            ✨ Paid with ERC-20
          </Text>
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
}

export default StepRow
