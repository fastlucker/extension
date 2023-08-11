import { Account as AccountInterface } from 'ambire-common/src/interfaces/account'
import { NetworkDescriptor } from 'ambire-common/src/interfaces/networkDescriptor'
import React from 'react'
import { View } from 'react-native'

import Checkbox from '@common/components/Checkbox'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import styles from './styles'

const Account = ({
  account,
  type,
  unused,
  isLastInSlot,
  isSelected,
  onSelect,
  onDeselect,
  isDisabled
}: {
  account: AccountInterface & { usedOnNetworks: NetworkDescriptor[] }
  type: 'legacy' | 'smart' | 'linked'
  unused: boolean
  isLastInSlot: boolean
  isSelected: boolean
  onSelect: (account: AccountInterface) => void
  onDeselect: (account: AccountInterface) => void
  isDisabled?: boolean
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

  const setLabel = (label: string, labelType: 'grey' | 'green') => {
    return (
      <View style={labelType === 'grey' ? styles.greyLabel : styles.greenLabel}>
        <Text
          weight="regular"
          fontSize={12}
          numberOfLines={1}
          color={labelType === 'grey' ? colors.martinique_80 : colors.greenHaze}
        >
          {label}
        </Text>
      </View>
    )
  }

  const isV1LinedAccount = (factoryAddr?: string) =>
    factoryAddr === '0xBf07a0Df119Ca234634588fbDb5625594E2a5BCA'

  const toggleSelectedState = () => {
    if (isSelected) {
      !!onDeselect && onDeselect(account)
    } else {
      !!onSelect && onSelect(account)
    }
  }

  return (
    <View
      key={account.addr}
      style={[flexbox.directionRow, flexbox.alignCenter, !isLastInSlot && spacings.mbTy]}
    >
      <View style={styles.container}>
        <Checkbox
          style={[{ marginBottom: 0 }, isDisabled && { opacity: 0.6 }]}
          // label={<View />}
          value={isSelected}
          onValueChange={toggleSelectedState}
          isDisabled={isDisabled}
        />

        <View style={[flexbox.flex1]}>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
            <Text
              weight="regular"
              fontSize={12}
              color={type === 'smart' || type === 'linked' ? colors.greenHaze : colors.brownRum}
              style={[spacings.mbMi, flexbox.flex1]}
              onPress={isDisabled ? undefined : toggleSelectedState}
            >
              {getAccountTypeLabel(type, account.creation)}
            </Text>
            {(!!unused || type === 'linked') && (
              <View style={[flexbox.directionRow, spacings.mbTy]}>
                {unused && setLabel('unused', 'grey')}
                {type === 'linked' && setLabel('linked', 'green')}
                {type === 'linked' &&
                  isV1LinedAccount(account.creation?.factoryAddr) &&
                  setLabel('v1', 'green')}
              </View>
            )}
          </View>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
            <Text
              fontSize={14}
              weight="semiBold"
              color={type === 'smart' || type === 'linked' ? colors.greenHaze : colors.brownRum}
              style={[flexbox.flex1]}
              onPress={isDisabled ? undefined : toggleSelectedState}
            >
              {trimAddress(account.addr, 30)}
            </Text>
            {!!account.usedOnNetworks.length && (
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <Text fontSize={12} weight="regular">
                  {t('used on ')}
                </Text>
                {account.usedOnNetworks.slice(0, 7).map((n, index: number, arr: string | any[]) => {
                  return (
                    <View
                      style={[
                        styles.networkIcon,
                        { marginLeft: index ? -5 : 0, zIndex: arr.length - index }
                      ]}
                      key={n.id}
                    >
                      <NetworkIcon name={n.id as any} width={18} height={18} />
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(Account)
