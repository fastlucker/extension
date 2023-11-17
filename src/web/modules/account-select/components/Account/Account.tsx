import React from 'react'
import { Image, Pressable, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { isAmbireV1LinkedAccount, isSmartAccount } from '@ambire-common/libs/account/account'
import PinIcon from '@common/assets/svg/PinIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import UnpinIcon from '@common/assets/svg/UnpinIcon'
import Badge from '@common/components/Badge'
import CopyText from '@common/components/CopyText'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getAccountPfpSource } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatars'

import getStyles from './styles'

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
  const MOCK_IS_PINNED = mainCtrl.selectedAccount === addr // @TODO: pinned account logic

  const selectAccount = (selectedAddr: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: selectedAddr }
    })
    onSelect && onSelect()
  }

  return (
    <Pressable key={addr} onPress={() => selectAccount(addr)}>
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
            <View style={[spacings.mrTy, flexboxStyles.justifyCenter]}>
              <Image
                style={{ width: 40, height: 40, borderRadius: BORDER_RADIUS_PRIMARY }}
                source={getAccountPfpSource(settingsCtrl.accountPreferences[addr]?.pfp)}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text fontSize={16} weight="regular">
                {addr}
              </Text>
              <Text appearance="secondaryText" fontSize={14} weight="semiBold">
                {settingsCtrl.accountPreferences[addr]?.label || DEFAULT_ACCOUNT_LABEL}
              </Text>
            </View>
            <View style={[spacings.mtTy, spacings.mlLg, flexboxStyles.directionRow]}>
              <Badge
                withIcon
                type={isSmartAccount(account) ? 'success' : 'warning'}
                text={isSmartAccount(account) ? t('Smart Account') : t('Legacy Account')}
              />
              {keystoreCtrl.keys.every((k) => !associatedKeys.includes(k.addr)) && (
                <Badge style={spacings.mlTy} type="info" text={t('View-only')} />
              )}
              {isSmartAccount(account) && isAmbireV1LinkedAccount(creation?.factoryAddr) && (
                <Badge style={spacings.mlTy} type="info" text={t('v1')} />
              )}
            </View>
          </View>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            {isCopyVisible && (
              <CopyText
                text={addr}
                iconColor={theme.primaryText}
                iconWidth={20}
                iconHeight={20}
                style={{
                  ...spacings.mrTy,
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }}
              />
            )}
            {MOCK_IS_PINNED ? (
              <UnpinIcon color={theme.secondaryText} style={[spacings.mr]} />
            ) : (
              <PinIcon color={theme.secondaryText} style={spacings.mr} />
            )}
            <SettingsIcon color={theme.secondaryText} />
          </View>
        </View>
      )}
    </Pressable>
  )
}

export default Account
