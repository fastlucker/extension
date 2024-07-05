import React from 'react'
import { Animated, Pressable, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import AccountAddress from '@common/components/AccountAddress'
import AccountBadges from '@common/components/AccountBadges'
import Avatar from '@common/components/Avatar'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useReverseLookup from '@common/hooks/useReverseLookup'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import flexboxStyles from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { useCustomHover } from '@web/hooks/useHover'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isTab } = getUiType()

const Account = ({
  account,
  onSelect,
  maxAccountAddrLength = 42,
  withSettings = true,
  renderRightChildren
}: {
  account: AccountInterface
  onSelect?: (addr: string) => void
  maxAccountAddrLength?: number
  withSettings?: boolean
  renderRightChildren?: () => React.ReactNode
}) => {
  const { addr, preferences } = account
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const { selectedAccount } = useAccountsControllerState()
  const { dispatch } = useBackgroundService()
  const { ens, ud, isLoading } = useReverseLookup({ address: addr })
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    },
    forceHoveredStyle: addr === selectedAccount
  })

  const selectAccount = () => {
    if (selectedAccount !== addr) {
      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: addr }
      })
    }

    onSelect && onSelect(addr)
  }

  const onSave = (value: string) => {
    dispatch({
      type: 'ACCOUNTS_CONTROLLER_UPDATE_ACCOUNT_PREFERENCES',
      params: [{ addr, preferences: { label: value, pfp: preferences.pfp } }]
    })
    addToast(t('Account label updated.'))
  }

  return (
    <Pressable onPress={selectAccount} {...bindAnim} testID="account">
      <Animated.View style={[styles.accountContainer, animStyle]}>
        <View style={[flexboxStyles.directionRow]}>
          <Avatar ens={ens} ud={ud} pfp={account.preferences.pfp} />
          <View>
            <View style={[flexboxStyles.directionRow]}>
              {!withSettings ? (
                <Text fontSize={isTab ? 16 : 14} weight="medium">
                  {account.preferences.label}
                </Text>
              ) : (
                <Editable
                  initialValue={account.preferences.label}
                  onSave={onSave}
                  fontSize={isTab ? 16 : 14}
                  height={24}
                  textProps={{
                    weight: 'medium'
                  }}
                  minWidth={100}
                  maxLength={40}
                />
              )}

              <AccountBadges accountData={account} />
            </View>
            <AccountAddress
              isLoading={isLoading}
              ens={ens}
              ud={ud}
              address={addr}
              plainAddressMaxLength={maxAccountAddrLength}
            />
          </View>
        </View>
        {renderRightChildren && (
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            {renderRightChildren()}
          </View>
        )}
      </Animated.View>
    </Pressable>
  )
}

export default React.memo(Account)
