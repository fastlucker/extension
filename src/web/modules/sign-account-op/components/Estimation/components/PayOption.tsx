import React from 'react'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { Avatar } from '@common/components/Avatar'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
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
  const accountPref = settingsCtrl.accountPreferences[account.addr]

  const label = accountPref?.label || DEFAULT_ACCOUNT_LABEL

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Avatar pfp={accountPref?.pfp} size={32} />
      <Text weight="medium">
        {label} ({!isGasTank ? shortenAddress(account.addr, 11) : 'Gas Tank'})
      </Text>
      <Text weight="medium"> - </Text>
      <TokenIcon
        containerHeight={32}
        containerWidth={32}
        networkSize={12}
        withContainer
        address={token.address}
        networkId={token.networkId}
        onGasTank={token.flags.onGasTank}
      />
      <Text weight="medium" style={spacings.mlTy}>
        {token.symbol}
      </Text>
    </View>
  )
}

export default PayOption
