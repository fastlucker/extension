import React from 'react'
import { Image, View } from 'react-native'

import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getAccountPfpSource } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatars'
import shortenAddress from '@web/utils/shortenAddress'

const PayOption = ({ account, token }: any) => {
  const settingsCtrl = useSettingsControllerState()
  const accountPref = settingsCtrl.accountPreferences[account.addr]
  const pfpSource = getAccountPfpSource(accountPref?.pfp)
  const label = accountPref.label || DEFAULT_ACCOUNT_LABEL

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Image
        style={[{ width: 32, height: 32, ...spacings.mrTy, ...common.borderRadiusPrimary } as any]}
        source={pfpSource}
      />
      <Text weight="medium">
        {label} ({shortenAddress(account.addr, 11)})
      </Text>
      <Text weight="medium"> - </Text>
      <TokenIcon
        containerHeight={32}
        containerWidth={32}
        withContainer
        address={token.address}
        networkId={token.networkId}
      />
      <Text weight="medium" style={spacings.mlTy}>
        {token.symbol}
      </Text>
    </View>
  )
}

export default PayOption
