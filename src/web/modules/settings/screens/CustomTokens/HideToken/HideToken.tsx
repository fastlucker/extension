import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import Input from '@common/components/Input'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const HideToken = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()

  const [address, setAddress] = useState('')

  const handleSetNetworkValue = useCallback(
    (networkOption: NetworkOption) => {
      setNetwork(networks.filter((net) => net.id === networkOption.value)[0])
    },
    [networks]
  )

  const networksOptions: NetworkOption[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon name={n.id as NetworkIconNameType} />
      })),
    [networks]
  )
  return (
    <View style={flexbox.flex1}>
      <Text fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]} weight="medium">
        {t('Hide Token')}
      </Text>
      <Input
        label={t('Token Address or Symbol')}
        onChange={setAddress}
        placeholder="Input token address or symbol"
      />
    </View>
  )
}

export default React.memo(HideToken)
