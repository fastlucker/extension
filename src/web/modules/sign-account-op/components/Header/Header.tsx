import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

// @ts-ignore
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Badge from '@common/components/Badge'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getAccountPfpSource } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatars'

import getStyles from './styles'

interface Props {
  networkName?: string
  networkId?: NetworkIconNameType
  isEOA: boolean
}
const Header: FC<Props> = ({ networkName, networkId, isEOA }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountPref = settingsCtrl.accountPreferences[selectedAccount]
  const selectedAccountLabel = selectedAccountPref?.label || DEFAULT_ACCOUNT_LABEL
  const selectedAccountPfp = getAccountPfpSource(selectedAccountPref?.pfp)

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.avatar} source={selectedAccountPfp} resizeMode="contain" />
        <Text appearance="secondaryText" weight="medium" fontSize={16}>
          {selectedAccountLabel}{' '}
        </Text>
        <Text appearance="primaryText" weight="medium" fontSize={16}>
          ({selectedAccount}){' '}
        </Text>
        <Badge
          type={isEOA ? 'warning' : 'success'}
          text={isEOA ? t('Legacy Account') : t('Smart Account')}
        />
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
