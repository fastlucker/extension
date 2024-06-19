import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import { Avatar } from '@common/components/Avatar'
import Badge from '@common/components/Badge'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconIdType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import getHeaderStyles from '@common/modules/header/components/Header/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
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
  const { minWidthSize, maxWidthSize } = useWindowSize()
  const accountsState = useAccountsControllerState()

  const isActionWindow = getUiType().isActionWindow

  const fontSize = useMemo(() => {
    return maxWidthSize(750) ? 16 : 14
  }, [maxWidthSize])

  const account = useMemo(() => {
    return accountsState.accounts.find((acc) => acc.addr === accountsState.selectedAccount)
  }, [accountsState.accounts, accountsState.selectedAccount])

  if (!account) return null

  return (
    <Header mode="custom" withAmbireLogo={!!withAmbireLogo && maxWidthSize(700)}>
      <View
        style={[headerStyles.widthContainer, !isActionWindow && { maxWidth: tabLayoutWidths.xl }]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
          <Avatar pfp={account.preferences.pfp} />
          <Text
            appearance="secondaryText"
            weight="medium"
            fontSize={fontSize}
            numberOfLines={1}
            style={spacings.mrMi}
          >
            {account.preferences.label}
          </Text>
          <Text
            selectable
            appearance="primaryText"
            weight="medium"
            fontSize={fontSize}
            style={spacings.mrMi}
          >
            ({minWidthSize(900) && shortenAddress(account.addr, 12)}
            {maxWidthSize(900) && minWidthSize(1000) && shortenAddress(account.addr, 20)}
            {maxWidthSize(1000) && minWidthSize(1150) && shortenAddress(account.addr, 30)}
            {maxWidthSize(1150) && account.addr})
          </Text>
          <Badge
            type={!account?.creation ? 'warning' : 'success'}
            text={!account?.creation ? t('Basic Account') : t('Smart Account')}
          />
          {!!networkName && !!networkId && (
            <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mlTy]}>
              <Text
                appearance="secondaryText"
                weight="regular"
                fontSize={fontSize}
                style={spacings.mrMi}
              >
                {t('on')}
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
