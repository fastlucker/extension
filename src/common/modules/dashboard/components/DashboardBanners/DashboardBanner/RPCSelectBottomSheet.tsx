import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'

import { Banner as BannerType } from '@ambire-common/interfaces/banner'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { RpcSelectorItem } from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/NetworkForm'

interface Props {
  isVisible: boolean
  sheetRef: any
  closeBottomSheet: () => void
  actions: BannerType['actions']
}

const RPCSelectBottomSheet: FC<Props> = ({ isVisible, sheetRef, closeBottomSheet, actions }) => {
  const { t } = useTranslation()
  const { networks, statuses } = useSettingsControllerState()
  const { addToast } = useToast()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const network = useMemo(() => {
    if (!isVisible) return

    return networks.find(
      // @ts-ignore
      (n) => n.id === actions.filter((a) => a.actionName === 'select-rpc-url')[0]?.meta?.network?.id
    )
  }, [actions, networks, isVisible])

  const handleSelectRpcUrl = useCallback(
    (url: string) => {
      const id = network?.id
      if (id) {
        dispatch({
          type: 'MAIN_CONTROLLER_UPDATE_NETWORK_PREFERENCES',
          params: {
            networkPreferences: {
              selectedRpcUrl: url
            },
            networkId: id
          }
        })
      }
    },
    [network?.id, dispatch]
  )

  useEffect(() => {
    if (!isVisible || statuses.updateNetworkPreferences !== 'SUCCESS') return

    addToast(t('Successfully switched the RPC URL for {{network}}', { network: network?.name }))

    setTimeout(() => {
      closeBottomSheet()
    }, 200)
  }, [isVisible, addToast, closeBottomSheet, network?.name, statuses.updateNetworkPreferences, t])

  if (!isVisible) return null

  return (
    <BottomSheet id="select-rpc-url" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
      <Text fontSize={20} weight="semiBold" numberOfLines={1} style={spacings.mbLg}>
        {t(`Select RPC URL for ${network?.name}`)}
      </Text>
      <View style={{ ...common.borderRadiusPrimary, ...common.hidden }}>
        {network?.rpcUrls.map((url: string, i: number) => {
          return (
            <RpcSelectorItem
              key={url}
              index={i}
              url={url}
              style={{ backgroundColor: theme.primaryBackground }}
              rpcUrlsLength={network?.rpcUrls?.length}
              shouldShowRemove={false}
              selectedRpcUrl={network?.selectedRpcUrl}
              forceLargeItems
              onPress={() => handleSelectRpcUrl(url)}
            />
          )
        })}
      </View>
    </BottomSheet>
  )
}

export default RPCSelectBottomSheet
