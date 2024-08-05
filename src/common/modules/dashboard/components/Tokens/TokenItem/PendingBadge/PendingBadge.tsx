import React from 'react'
import {ColorValue, View} from 'react-native'
import Text from '@common/components/Text'
import flexboxStyles from '@common/styles/utils/flexbox'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { useTranslation } from '@common/config/localization'
import { SvgProps } from 'react-native-svg'

interface IconProps extends SvgProps {
  width?: number
  height?: number
}

const PendingBadge = ({
  amount,
  amountFormatted,
  label,
  Icon,
  primaryColor
}: {
  amount: bigint
  amountFormatted: string
  label: string
  Icon: React.ComponentType<IconProps>
  primaryColor: ColorValue
}) => {
  const { t } = useTranslation()

  return (
    <View
      style={[
        spacings.pvTy,
        spacings.phTy,
        spacings.mbMi,
        flexboxStyles.alignSelfStart,
        flexboxStyles.directionRow,
        {
          borderRadius: BORDER_RADIUS_PRIMARY,
          borderWidth: 1,
          borderColor: primaryColor
        }
      ]}
    >
      <Text selectable color={primaryColor} fontSize={14} numberOfLines={1} style={[spacings.mrTy]}>
        {t(`${amount > 0n ? '+' : ''}${amountFormatted} ${label}`)}
      </Text>
      <Icon color={primaryColor} width={20} height={21} />
    </View>
  )
}

export default React.memo(PendingBadge)
