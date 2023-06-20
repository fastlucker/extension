import React, { useState } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@common/config/localization'
import Text from '@common/components/Text'
import flexbox from '@common/styles/utils/flexbox'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import Checkbox from '@common/components/Checkbox'

interface HardwareWalletAccountProps {
  smartAccount?: boolean
  address: string
  balance: string
  linked?: boolean
  last?: boolean
}
const HardwareWalletAccount = ({
  smartAccount,
  address,
  balance,
  linked,
  last
}: HardwareWalletAccountProps) => {
  const { t } = useTranslation()

  const [isIncluded, setIsIncluded] = useState(false)

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.justifySpaceBetween,
        flexbox.alignEnd,
        spacings.phSm,
        spacings.pvSm,
        !last && spacings.mbTy,
        {
          backgroundColor: colors.melrose_15,
          borderRadius: 12,
          borderColor: colors.scampi_20,
          width: 504
        }
      ]}
    >
      <Checkbox
        style={{ marginBottom: 0 }}
        label={
          <Text
            shouldScale={false}
            fontSize={12}
            color={smartAccount ? colors.greenHaze : colors.brownRum}
          >
            {t(`${smartAccount ? 'Smart Account' : 'Legacy Account'}`)}
            <br />
            <Text
              shouldScale={false}
              fontSize={14}
              weight="semiBold"
              color={smartAccount ? colors.greenHaze : colors.brownRum}
            >
              {address}
            </Text>
          </Text>
        }
        value={isIncluded}
        onValueChange={() => setIsIncluded(!isIncluded)}
      />
      <View>
        {linked && (
          <Text
            shouldScale={false}
            fontSize={14}
            color={colors.greenHaze}
            style={{ textAlign: 'right' }}
          >
            {t('Linked')}
          </Text>
        )}
        <Text shouldScale={false} fontSize={14} color={colors.martinique} weight="semiBold">
          {balance}
        </Text>
      </View>
    </View>
  )
}
export default HardwareWalletAccount
