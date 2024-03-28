import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import { Avatar } from '@common/components/Avatar'
import Badge from '@common/components/Badge'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconIdType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import getHeaderStyles from '@common/modules/header/components/Header/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import { tabLayoutWidths } from '../TabLayoutWrapper'

interface Props {
  networkName?: string
  networkId?: NetworkIconIdType
  withAmbireLogo?: boolean
}
const HeaderAccountAndNetworkInfo: FC<Props> = ({
  networkName,
  networkId,
  withAmbireLogo = true
}) => {
  const { t } = useTranslation()
  const { styles: headerStyles } = useTheme(getHeaderStyles)
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountPref = settingsCtrl.accountPreferences[selectedAccount]
  const selectedAccountLabel = selectedAccountPref?.label || DEFAULT_ACCOUNT_LABEL
  const { minWidthSize, maxWidthSize } = useWindowSize()

  const isNotification = getUiType().isNotification

  const fontSize = useMemo(() => {
    return maxWidthSize(750) ? 16 : 14
  }, [maxWidthSize])

  const account = useMemo(() => {
    return mainCtrl.accounts.find((acc) => acc.addr === mainCtrl.selectedAccount)
  }, [mainCtrl.accounts, mainCtrl.selectedAccount])

  return (
    <Header mode="custom" withAmbireLogo={!!withAmbireLogo && maxWidthSize(700)}>
      <View
        style={[headerStyles.widthContainer, !isNotification && { maxWidth: tabLayoutWidths.xl }]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
          <Avatar pfp={selectedAccountPref?.pfp} />
          <Text appearance="secondaryText" weight="medium" fontSize={fontSize} numberOfLines={1}>
            {selectedAccountLabel}{' '}
          </Text>
          <Text selectable appearance="primaryText" weight="medium" fontSize={fontSize}>
            ({minWidthSize(900) && shortenAddress(selectedAccount, 12)}
            {maxWidthSize(900) && minWidthSize(1000) && shortenAddress(selectedAccount, 20)}
            {maxWidthSize(1000) && minWidthSize(1150) && shortenAddress(selectedAccount, 30)}
            {maxWidthSize(1150) && selectedAccount}){' '}
          </Text>
          <Badge
            type={!account?.creation ? 'warning' : 'success'}
            text={!account?.creation ? t('Basic Account') : t('Smart Account')}
          />
          {!!networkName && !!networkId && (
            <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mlTy]}>
              <Text appearance="secondaryText" weight="regular" fontSize={fontSize}>
                {t('on')}{' '}
              </Text>
              <Text
                appearance="secondaryText"
                weight="regular"
                style={spacings.mrMi}
                fontSize={fontSize}
              >
                {networkName || t('Unknown network')}
              </Text>
              {networkId && maxWidthSize(800) ? (
                <NetworkIcon id={networkId} withTooltip={false} size={40} />
              ) : null}
            </View>
          )}
        </View>
        {!!withAmbireLogo && maxWidthSize(700) && (
          <View style={spacings.pl}>
            <AmbireLogoHorizontal />
          </View>
        )}
      </View>
    </Header>
  )
}

export default React.memo(HeaderAccountAndNetworkInfo)
