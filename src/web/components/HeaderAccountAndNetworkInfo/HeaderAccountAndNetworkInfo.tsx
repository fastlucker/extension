import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AccountAddress from '@common/components/AccountAddress'
import AccountBadges from '@common/components/AccountBadges'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Avatar from '@common/components/Avatar'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconIdType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useReverseLookup from '@common/hooks/useReverseLookup'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import getHeaderStyles from '@common/modules/header/components/Header/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import { getUiType } from '@web/utils/uiType'

import { tabLayoutWidths } from '../TabLayoutWrapper'
import getStyles from './styles'

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
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const accountsState = useAccountsControllerState()

  const account = useMemo(() => {
    return accountsState.accounts.find((acc) => acc.addr === accountsState.selectedAccount)
  }, [accountsState.accounts, accountsState.selectedAccount])

  const { isLoading, ens, ud } = useReverseLookup({ address: account?.addr || '' })

  const isActionWindow = getUiType().isActionWindow

  const fontSize = useMemo(() => {
    return maxWidthSize(750) ? 16 : 14
  }, [maxWidthSize])

  if (!account) return null

  return (
    <Header
      mode="custom"
      withAmbireLogo={!!withAmbireLogo && maxWidthSize(700)}
      style={styles.container}
    >
      <View
        style={[headerStyles.widthContainer, !isActionWindow && { maxWidth: tabLayoutWidths.xl }]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
          <Avatar pfp={account.preferences.pfp} ens={ens} ud={ud} />
          <View>
            <View style={[flexbox.directionRow]}>
              <Text fontSize={16} weight="medium">
                {account.preferences.label}
              </Text>

              <AccountBadges accountData={account} />
            </View>
            <AccountAddress isLoading={isLoading} ens={ens} ud={ud} address={account.addr} />
          </View>
          {!!networkName && !!networkId && (
            <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mlLg]}>
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
