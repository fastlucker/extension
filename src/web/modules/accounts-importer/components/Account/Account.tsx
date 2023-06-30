import React, { useState } from 'react'
import { View } from 'react-native'

import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { useTranslation } from '@common/config/localization'
import common from '@common/styles/utils/common'

// TODO: each legacy account in the list should be grouped with an Ambire Smart Account
// TODO: each list item must be selectable (checkbox)

const Account = ({
  acc,
  idx,
  handleLayout
}: {
  acc: any
  idx: number
  handleLayout: (i: string, e: any) => void
}) => {
  const { t } = useTranslation()

  const [isIncluded, setIsIncluded] = useState(false)
  const smartAccount = false
  const linked = true
  if (!acc.address) return

  const trimAddress = (address: string, maxLength: number) => {
    if (address.length <= maxLength) {
      return address
    }

    const prefixLength = Math.floor((maxLength - 3) / 2)
    const suffixLength = Math.ceil((maxLength - 3) / 2)

    const prefix = address.slice(0, prefixLength)
    const suffix = address.slice(-suffixLength)

    return `${prefix}...${suffix}`
  }

  return (
    <View
      key={acc.address}
      style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}
      onLayout={(e) => handleLayout(acc.index, e)}
    >
      <Text weight="semiBold" color={colors.martinique} style={{ width: 35 }}>
        {acc?.index || idx + 1}
      </Text>
      <View
        style={{
          backgroundColor: isIncluded ? colors.violet : '#BBBDE4',
          width: 3,
          height: '100%',
          ...spacings.mlTy,
          ...spacings.mrTy
        }}
      />
      <View
        style={{
          ...flexbox.directionRow,
          ...flexbox.justifySpaceBetween,
          ...flexbox.alignEnd,
          ...spacings.phSm,
          ...spacings.pvSm,
          ...common.borderRadiusPrimary,
          backgroundColor: colors.melrose_15,
          borderColor: colors.scampi_20,
          width: 504
        }}
      >
        <Checkbox
          style={{ marginBottom: 0 }}
          label={
            <View>
              <Text
                shouldScale={false}
                fontSize={12}
                color={smartAccount ? colors.greenHaze : colors.brownRum}
              >
                {t(`${smartAccount ? 'Smart Account' : 'Legacy Account'}`)}
              </Text>
              <Text
                shouldScale={false}
                fontSize={14}
                weight="semiBold"
                color={smartAccount ? colors.greenHaze : colors.brownRum}
              >
                {trimAddress(acc.address, 32)}
              </Text>
            </View>
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
            $98.98
          </Text>
        </View>
      </View>
    </View>
  )
}

export default React.memo(Account)
