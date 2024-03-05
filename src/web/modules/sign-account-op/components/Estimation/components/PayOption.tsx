import React from 'react'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { Avatar } from '@common/components/Avatar'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useWindowSize from '@common/hooks/useWindowSize'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import shortenAddress from '@web/utils/shortenAddress'

const PayOption = ({
  account,
  token,
  isGasTank
}: {
  account: Account
  token: TokenResult
  isGasTank: boolean
}) => {
  const settingsCtrl = useSettingsControllerState()
  const { maxWidthSize } = useWindowSize()
  const isL = maxWidthSize('l')
  const accountPref = settingsCtrl.accountPreferences[account.addr]

  const label = accountPref?.label || DEFAULT_ACCOUNT_LABEL

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        {
          width: '100%'
        }
      ]}
    >
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          spacings.mrTy,
          {
            flexGrow: 1,
            flexShrink: 1
          }
        ]}
      >
        <Avatar pfp={accountPref?.pfp} size={32} />
        <View style={[flexbox.flex1, spacings.mrMi]}>
          <Text weight="medium" fontSize={isL ? 14 : 12} numberOfLines={1}>
            {label}
          </Text>
          <Text weight="medium" fontSize={10} numberOfLines={1} appearance="secondaryText">
            ({!isGasTank ? shortenAddress(account.addr, isL ? 23 : 13) : 'Gas Tank'})
          </Text>
        </View>
      </View>
      <View>
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.justifyEnd,
            flexbox.flex1,
            {
              minWidth: 'fit-content',
              flexShrink: 0
            }
          ]}
        >
          <TokenIcon
            containerHeight={isL ? 32 : 24}
            containerWidth={isL ? 32 : 24}
            width={isL ? 20 : 16}
            height={isL ? 20 : 16}
            networkSize={10}
            address={token.address}
            networkId={token.networkId}
            onGasTank={token.flags.onGasTank}
          />
          <Text weight="medium" numberOfLines={1} style={spacings.mlMi} fontSize={isL ? 14 : 12}>
            {token.symbol}
          </Text>
        </View>
        <View
          style={{
            marginLeft: 'auto'
          }}
        >
          <Text fontSize={10} appearance="secondaryText" weight="medium">
            Fee token
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PayOption
