import React, { useEffect } from 'react'
import { Animated, Pressable, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { isAmbireV1LinkedAccount, isSmartAccount } from '@ambire-common/libs/account/account'
import { Avatar } from '@common/components/Avatar'
import Badge from '@common/components/Badge'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { useCustomHover } from '@web/hooks/useHover'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isTab } = getUiType()

const Account = ({
  account,
  onSelect,
  maxAccountAddrLength,
  withSettings = true,
  renderRightChildren
}: {
  account: AccountInterface
  onSelect?: (addr: string) => void
  maxAccountAddrLength?: number
  withSettings?: boolean
  renderRightChildren?: () => React.ReactNode
}) => {
  const { addr, creation, associatedKeys } = account
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const keystoreCtrl = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    },
    forceHoveredStyle: addr.toLowerCase() === mainCtrl.selectedAccount?.toLowerCase()
  })

  const selectAccount = () => {
    // No need to dispatch if the account is already selected
    if (onSelect && mainCtrl.selectedAccount?.toLowerCase() === addr?.toLowerCase()) {
      onSelect(addr)
      return
    }

    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: addr }
    })
  }

  const onSave = (value: string) => {
    dispatch({
      type: 'SETTINGS_CONTROLLER_ADD_ACCOUNT_PREFERENCES',
      params: {
        [addr]: {
          ...settingsCtrl.accountPreferences[addr],
          label: value
        }
      }
    })
    addToast(t('Account label updated.'))
  }

  useEffect(() => {
    if (
      mainCtrl.latestMethodCall === 'selectAccount' &&
      mainCtrl.status === 'SUCCESS' &&
      addr.toLowerCase() === mainCtrl.selectedAccount?.toLowerCase()
    ) {
      onSelect && onSelect(addr)
    }
  }, [addr, mainCtrl.latestMethodCall, mainCtrl.selectedAccount, mainCtrl.status, onSelect])

  return (
    <Pressable onPress={selectAccount} {...bindAnim}>
      <Animated.View style={[styles.accountContainer, animStyle]}>
        <View style={[flexboxStyles.directionRow]}>
          <View style={[flexboxStyles.justifyCenter]}>
            <Avatar pfp={settingsCtrl.accountPreferences[addr]?.pfp} />
          </View>
          <View>
            <View style={flexboxStyles.directionRow}>
              <Text selectable fontSize={isTab ? 16 : 14} weight="regular">
                {maxAccountAddrLength ? shortenAddress(addr, maxAccountAddrLength) : addr}
              </Text>

              <Badge
                withIcon
                style={spacings.mlTy}
                type={isSmartAccount(account) ? 'success' : 'warning'}
                text={isSmartAccount(account) ? t('Smart Account') : t('Basic Account')}
              />
              {keystoreCtrl.keys.every((k) => !associatedKeys.includes(k.addr)) && (
                <Badge style={spacings.mlTy} type="info" text={t('View-only')} />
              )}
              {isSmartAccount(account) && isAmbireV1LinkedAccount(creation?.factoryAddr) && (
                <Badge style={spacings.mlTy} type="info" text={t('Ambire v1')} />
              )}
            </View>
            {!withSettings ? (
              <Text appearance="secondaryText" fontSize={14} weight="semiBold">
                {settingsCtrl.accountPreferences[addr]?.label || DEFAULT_ACCOUNT_LABEL}
              </Text>
            ) : (
              <Editable
                value={settingsCtrl.accountPreferences[addr]?.label}
                onSave={onSave}
                fontSize={14}
                height={24}
                textProps={{
                  weight: 'semiBold',
                  appearance: 'secondaryText'
                }}
                minWidth={50}
                maxLength={40}
              />
            )}
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
