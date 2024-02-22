import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Select from '@common/components/Select'
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

const AddToken = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()

  const [network, setNetwork] = useState<NetworkDescriptor>(
    networks.filter((n) => n.id === 'ethereum')[0]
  )

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
        {t('Add Token')}
      </Text>
      <Select
        setValue={handleSetNetworkValue}
        options={networksOptions}
        value={networksOptions.filter((opt) => opt.value === network.id)[0]}
        label={t('Choose Network')}
        style={spacings.mbMd}
      />
      <Input
        onChange={setAddress}
        label={t('Token Address')}
        placeholder="0x..."
        containerStyle={spacings.mb4Xl}
      />
      <Button
        disabled
        text={t('Add Token')}
        hasBottomSpacing={false}
        style={{ maxWidth: 196 }}
        onPress={() => {
          // setChangePasswordReady(false)
          // resetField('password')
          // resetField('newPassword')
          // resetField('confirmNewPassword')
        }}
      />{' '}
    </View>
  )
}

export default React.memo(AddToken)
