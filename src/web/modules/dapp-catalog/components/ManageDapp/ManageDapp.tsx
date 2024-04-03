import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { IHandles } from 'react-native-modalize/lib/options'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { Dapp } from '@web/extension-services/background/controllers/dapps'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import DappControl from '@web/modules/dapp-catalog/components/DappControl'

import getStyles from './styles'

type Props = {
  dapp: Dapp | null
  isCurrentDapp?: boolean
  sheetRef: React.RefObject<IHandles>
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const ManageDapp = ({
  dapp,
  isCurrentDapp,
  sheetRef,
  openBottomSheet,
  closeBottomSheet
}: Props) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()

  const [network, setNetwork] = useState<NetworkDescriptor>(
    networks.filter((n) => Number(n.chainId) === dapp?.chainId)[0] ||
      networks.filter((n) => n.id === 'ethereum')[0]
  )
  const { dispatch } = useBackgroundService()

  const networksOptions: NetworkOption[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon id={n.id} />
      })),
    [networks]
  )

  const handleSetNetworkValue = useCallback(
    (networkOption: NetworkOption) => {
      if (dapp?.url) {
        const newNetwork = networks.filter((net) => net.id === networkOption.value)[0]
        setNetwork(newNetwork)
        dispatch({
          type: 'CHANGE_CURRENT_DAPP_NETWORK',
          params: {
            origin: dapp.url,
            chainId: Number(newNetwork.chainId)
          }
        })
      }
    },
    [networks, dapp?.url, dispatch]
  )

  return (
    <BottomSheet id="dapp-footer" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
      <View style={[spacings.mbLg, spacings.ptSm]}>
        <DappControl
          dapp={dapp}
          inModal
          isCurrentDapp={isCurrentDapp}
          openBottomSheet={openBottomSheet}
          closeBottomSheet={closeBottomSheet}
        />
      </View>
      <View style={styles.networkSelectorContainer}>
        <Text fontSize={14} style={flexbox.flex1}>
          {t('Select dApp Network')}
        </Text>
        <Select
          setValue={handleSetNetworkValue}
          style={{ width: 230 }}
          controlStyle={{ height: 40 }}
          options={networksOptions}
          value={networksOptions.filter((opt) => opt.value === network.id)[0]}
        />
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
        <Text style={spacings.mrLg} fontSize={12}>
          {t(
            'Our dApp Catalog is a curated collection of popular and verified decentralized apps. You can personalize it by adding the current dApp to the list, allowing quick and secure navigation in future use.'
          )}
        </Text>
        <Button size="small" type="secondary" text={t('Add to dApp Catalog')} disabled />
      </View>
    </BottomSheet>
  )
}

export default React.memo(ManageDapp)
