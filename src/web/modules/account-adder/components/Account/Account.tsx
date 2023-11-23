import React from 'react'
import { Dimensions, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { isAmbireV1LinkedAccount } from '@ambire-common/libs/account/account'
import Badge from '@common/components/Badge'
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
              testID='account-checkbox'
              fontSize={16}
              appearance="primaryText"
              style={[flexbox.flex1]}
              onPress={isDisabled ? undefined : toggleSelectedState}
            >
              {/* TODO: this is a temp solution because Dimensions gets the static sizes of the window and doesn't update dynamically */}
              {Dimensions.get('window').width < 1300
                ? shortenAddress(account.addr, 32)
                : account.addr}
            </Text>
            {(!!unused || type === 'linked') && (
              <View style={[flexbox.directionRow]}>
                {type === 'linked' && (
                  <View
                    style={
                      !!isAmbireV1LinkedAccount(account.creation?.factoryAddr) && spacings.mrMi
                    }
                  >
                    <Badge text={t('linked')} type="primary" />
                  </View>
                )}
                {type === 'linked' && isAmbireV1LinkedAccount(account.creation?.factoryAddr) && (
                  <Badge text={t('v1')} type="primary" />
                )}
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
              {type === 'legacy' ? (
                <Badge withIcon text={t('Legacy Account')} type="warning" />
              ) : (
                <Badge withIcon text={t('Smart Account')} type="success" />
              )}
            </Text>
            {!!unused && <Badge text={t('unused')} />}
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
