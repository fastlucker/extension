import { Account as AccountInterface } from 'ambire-common/src/interfaces/account'
import { NetworkDescriptor } from 'ambire-common/src/interfaces/networkDescriptor'
import React from 'react'
import { View } from 'react-native'

import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

const Account = ({
  account,
  type,
  isLastInSlot,
  isSelected,
  onSelect,
  onDeselect
}: {
  account: AccountInterface & { usedOnNetworks: NetworkDescriptor[] }
  type: 'legacy' | 'smart' | 'linked'
  isLastInSlot: boolean
  isSelected: boolean
  onSelect: (account: AccountInterface) => void
  onDeselect: (account: AccountInterface) => void
}) => {
  const { t } = useTranslation()

  if (!account.addr) return

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

  const getAccountTypeLabel = (accType: 'legacy' | 'smart' | 'linked', creation: any) => {
    if (accType === 'legacy' || !creation) return t('Legacy Account')
    if (accType === 'smart' || creation) return t('Smart Account')
    return ''
  }

  return (
    <View
      key={account.addr}
      style={[flexbox.directionRow, flexbox.alignCenter, !isLastInSlot && spacings.mbTy]}
    >
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
                color={type === 'smart' || type === 'linked' ? colors.greenHaze : colors.brownRum}
              >
                {getAccountTypeLabel(type, account.creation)}
              </Text>
              <Text
                shouldScale={false}
                fontSize={14}
                weight="semiBold"
                color={type === 'smart' || type === 'linked' ? colors.greenHaze : colors.brownRum}
              >
                {trimAddress(account.addr, 32)}
              </Text>
            </View>
          }
          value={isSelected}
          onValueChange={() => {
            if (isSelected) {
              !!onDeselect && onDeselect(account)
            } else {
              !!onSelect && onSelect(account)
            }
          }}
        />
        <View>
          {type === 'linked' && (
            <Text
              shouldScale={false}
              fontSize={14}
              color={colors.greenHaze}
              style={{ textAlign: 'right' }}
            >
              {t('Linked')}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default React.memo(Account)
