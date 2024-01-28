import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

// @ts-ignore
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { Avatar } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatar'

import getStyles from './styles'

interface Props {
  networkName?: string
  networkId?: NetworkIconNameType
}
const Header: FC<Props> = ({ networkName, networkId }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountPref = settingsCtrl.accountPreferences[selectedAccount]
  const selectedAccountLabel = selectedAccountPref?.label || DEFAULT_ACCOUNT_LABEL

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Avatar pfp={selectedAccountPref?.pfp} />
        <Text appearance="secondaryText" weight="medium" fontSize={16}>
          {selectedAccountLabel}{' '}
        </Text>
        <Text appearance="primaryText" weight="medium" fontSize={16}>
          ({selectedAccount}){' '}
        </Text>
        <View style={styles.network}>
          <Text appearance="secondaryText" weight="regular" fontSize={16}>
            {t('on')}{' '}
          </Text>
          <Text
            appearance="secondaryText"
            weight="regular"
            style={styles.networkName}
            fontSize={16}
          >
            {networkName || t('Unknown network')}
          </Text>
          {networkId ? <NetworkIcon name={networkId} style={styles.networkIcon} /> : null}
        </View>
      </View>
      <AmbireLogoHorizontal />
    </View>
  )
}

export default Header
