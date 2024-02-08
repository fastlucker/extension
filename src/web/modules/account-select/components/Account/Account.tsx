import React from 'react'
import { Pressable, View } from 'react-native'

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
  isCopyVisible = true
}: {
  account: AccountInterface
  onSelect?: () => void
  isCopyVisible?: boolean
}) => {
  const { addr, creation, associatedKeys } = account
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const keystoreCtrl = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()

  const selectAccount = (selectedAddr: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: selectedAddr }
    })
    onSelect && onSelect()
  }

  return (
    <Pressable
      key={addr}
      onPress={() => {
        selectAccount(addr)
      }}
    >
      {({ hovered }: any) => (
        <View
          style={[
            styles.accountContainer,
            {
              backgroundColor:
                addr === mainCtrl.selectedAccount || hovered
                  ? theme.secondaryBackground
                  : 'transparent'
            }
          ]}
        >
          <View style={[flexboxStyles.directionRow]}>
            <View style={[flexboxStyles.justifyCenter]}>
              <Avatar pfp={settingsCtrl.accountPreferences[addr]?.pfp} />
            </View>
            <View>
              <View style={flexboxStyles.directionRow}>
                <Text fontSize={isTab ? 16 : 14} weight="regular">
                  {isTab ? addr : shortenAddress(addr, 18)}
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
                  <Badge style={spacings.mlTy} type="info" text={t('v1')} />
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
                  ...spacings.mrTy,
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
        </View>
      )}
    </Pressable>
  )
}

export default Account
