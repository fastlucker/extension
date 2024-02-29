import React from 'react'
import { Animated, Pressable, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { isAmbireV1LinkedAccount, isSmartAccount } from '@ambire-common/libs/account/account'
import { Avatar } from '@common/components/Avatar'
import Badge from '@common/components/Badge'
import CopyText from '@common/components/CopyText'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
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
  isCopyVisible = true,
  maxAccountAddrLength
}: {
  account: AccountInterface
  onSelect?: (addr: string) => void
  isCopyVisible?: boolean
  maxAccountAddrLength?: number
}) => {
  const { addr, creation, associatedKeys } = account
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

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
    forceHoveredStyle: addr === mainCtrl.selectedAccount
  })

  const selectAccount = (selectedAddr: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: selectedAddr }
    })
    onSelect && onSelect(addr)
  }

  return (
    <Pressable
      testID='account'
      key={addr}
      onPress={() => {
        selectAccount(addr)
      }}
      {...bindAnim}
    >
      <Animated.View style={[styles.accountContainer, animStyle]}>
        <View style={[flexboxStyles.directionRow]}>
          <View style={[flexboxStyles.justifyCenter]}>
            <Avatar pfp={settingsCtrl.accountPreferences[addr]?.pfp} />
          </View>
          <View>
            <View style={flexboxStyles.directionRow}>
              <Text fontSize={isTab ? 16 : 14} weight="regular">
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
            <Text appearance="secondaryText" fontSize={14} weight="semiBold">
              {settingsCtrl.accountPreferences[addr]?.label || DEFAULT_ACCOUNT_LABEL}
            </Text>
          </View>
        </View>
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          {isCopyVisible && (
            <CopyText
              text={addr}
              iconColor={theme.secondaryText}
              iconWidth={20}
              iconHeight={20}
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent'
              }}
            />
          )}
          {/* @TODO: Implement pinned accounts and account settings */}
          {/* {MOCK_IS_PINNED ? (
              <UnpinIcon color={theme.secondaryText} style={[spacings.mr]} />
            ) : (
              <PinIcon color={theme.secondaryText} style={spacings.mr} />
            )}
            <SettingsIcon color={theme.secondaryText} /> */}
        </View>
      </Animated.View>
    </Pressable>
  )
}

export default React.memo(Account)
