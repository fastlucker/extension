import React from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkId } from '@ambire-common/interfaces/network'
import OpenIcon from '@common/assets/svg/OpenIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import BottomSheet from '@common/components/BottomSheet'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

import Option from './Option/Option'
import getStyles from './styles'

interface Props {
  sheetRef: ReturnType<typeof useModalize>['ref']
  closeBottomSheet: () => void
  selectedNetworkId: NetworkId | null
  openBlockExplorer: (url?: string) => void
}

const NetworkBottomSheet = ({
  sheetRef,
  closeBottomSheet,
  selectedNetworkId,
  openBlockExplorer
}: Props) => {
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { theme, styles } = useTheme(getStyles)
  const { networks } = useNetworksControllerState()
  const networkData = networks.find((network) => network.id === selectedNetworkId)

  return (
    <BottomSheet
      id="dashboard-networks-network"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
    >
      <View style={[styles.item, spacings.pvSm, spacings.mb3Xl]}>
        {!!selectedNetworkId && <NetworkIcon size={32} id={selectedNetworkId} />}
        <Text fontSize={16} weight="medium" style={spacings.mlMi}>
          {networkData?.name || 'Unknown Network'}
        </Text>
      </View>
      <Option
        renderIcon={<SettingsIcon width={27} height={27} color={theme.secondaryText} />}
        text="Go to Network Settings"
        onPress={() => {
          try {
            navigate(`${WEB_ROUTES.networksSettings}?networkId=${selectedNetworkId}`)
          } catch {
            addToast('Failed to open network settings.', { type: 'error' })
          }
        }}
      />
      <Option
        renderIcon={<OpenIcon width={20} height={20} color={theme.secondaryText} />}
        text="Open current account in block explorer"
        onPress={() => {
          openBlockExplorer(networkData?.explorerUrl)
        }}
      />
    </BottomSheet>
  )
}

export default NetworkBottomSheet
