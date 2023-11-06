import React from 'react'
import { Dimensions, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { isAmbireV1LinkedAccount } from '@ambire-common/libs/account/account'
import InfoIcon from '@common/assets/svg/InfoIcon'
import Checkbox from '@common/components/Checkbox'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import shortenAddress from '@web/utils/shortenAddress'

import getStyles from './styles'

export const setPrimaryLabel = (text: string) => {
  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.primaryLabel}>
      <Text fontSize={12} numberOfLines={1} appearance="primary">
        {text}
      </Text>
    </View>
  )
}

export const setSuccessLabel = (text: string) => {
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={[styles.successLabel, flexbox.directionRow, flexbox.alignCenter]}>
      <Text fontSize={12} appearance="successText" style={spacings.mrMi}>
        {text}
      </Text>

      <InfoIcon color={theme.successDecorative as any} width={16} height={16} />
    </View>
  )
}

export const setDefaultLabel = (text: string) => {
  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.defaultLabel}>
      <Text fontSize={12} numberOfLines={1} appearance="secondaryText">
        {text}
      </Text>
    </View>
  )
}

export const setWarningLabel = (text: string) => {
  const { styles } = useTheme(getStyles)

  return (
    <View style={[styles.warningLabel, flexbox.directionRow, flexbox.alignCenter]}>
      <Text fontSize={12} numberOfLines={1} color="#5C4E22" style={spacings.mrMi}>
        {text}
      </Text>
      <InfoIcon color="#B89C4B" width={16} height={16} />
    </View>
  )
}

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
  const { styles, theme } = useTheme(getStyles)

  if (!account.addr) return

  const getAccountTypeLabel = (accType: 'legacy' | 'smart' | 'linked', creation: any) => {
    if (accType === 'legacy' || !creation) return t('Legacy Account')
    if (accType === 'smart' || creation) return t('Smart Account')
    return ''
  }

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
          style={{ marginBottom: 0 }}
          value={isSelected}
          onValueChange={toggleSelectedState}
          uncheckedBorderColor={theme.primaryText}
          isDisabled={isDisabled}
        />

        <View style={[flexbox.flex1]}>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
            <Text
              fontSize={16}
              appearance="primaryText"
              style={[flexbox.flex1]}
              onPress={isDisabled ? undefined : toggleSelectedState}
            >
              {Dimensions.get('window').width < 1300 // TODO: this is a temp solution
                ? shortenAddress(account.addr, 32)
                : account.addr}
            </Text>
            {(!!unused || type === 'linked') && (
              <View style={[flexbox.directionRow, spacings.mbTy]}>
                {unused && setDefaultLabel('unused')}
                {type === 'linked' && setPrimaryLabel('linked')}
                {type === 'linked' &&
                  isAmbireV1LinkedAccount(account.creation?.factoryAddr) &&
                  setPrimaryLabel('v1')}
              </View>
            )}
          </View>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
            <Text
              weight="regular"
              fontSize={12}
              color={type === 'smart' || type === 'linked' ? colors.greenHaze : colors.husk}
              style={[spacings.mbMi, flexbox.flex1]}
              onPress={isDisabled ? undefined : toggleSelectedState}
            >
              {type === 'legacy'
                ? setWarningLabel(getAccountTypeLabel(type, account.creation))
                : setSuccessLabel(getAccountTypeLabel(type, account.creation))}
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
