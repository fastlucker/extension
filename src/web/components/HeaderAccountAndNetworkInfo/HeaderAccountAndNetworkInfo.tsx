import React, { FC, useMemo } from 'react'
import { View } from 'react-native'

import { isSmartAccount } from '@ambire-common/libs/account/account'
import AccountAddress from '@common/components/AccountAddress'
import AccountBadges from '@common/components/AccountBadges'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Avatar from '@common/components/Avatar'
import DomainBadge from '@common/components/Avatar/DomainBadge'
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
  withAmbireLogo?: boolean
}

// @TODO: Not renamed because this component will no longer exist in the near future
// @TODO: refactor the header component @petromir.
const HeaderAccountAndNetworkInfo: FC<Props> = ({ withAmbireLogo = true }) => {
  const { styles: headerStyles } = useTheme(getHeaderStyles)
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const accountsState = useAccountsControllerState()

  const account = useMemo(() => {
    return accountsState.accounts.find((acc) => acc.addr === accountsState.selectedAccount)
  }, [accountsState.accounts, accountsState.selectedAccount])

  const { isLoading, ens, ud } = useReverseLookup({ address: account?.addr || '' })

  const isActionWindow = getUiType().isActionWindow

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
          <Avatar pfp={account.preferences.pfp} isSmart={isSmartAccount(account)} />
          <View>
            <View style={[flexbox.directionRow]}>
              <Text fontSize={16} weight="medium">
                {account.preferences.label}
              </Text>

              <AccountBadges accountData={account} />
            </View>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <DomainBadge ens={ens} ud={ud} />
              <AccountAddress isLoading={isLoading} ens={ens} ud={ud} address={account.addr} />
            </View>
          </View>
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
