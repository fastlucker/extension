import React from 'react'
import { Pressable, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import OpenIcon from '@common/assets/svg/OpenIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import BottomSheet from '@common/components/BottomSheet'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

const getNetworkName = (networkId: NetworkDescriptor['id'], networkName?: string) => {
  if (networkId === 'rewards') {
    return 'Ambire Rewards'
  }
  if (networkId === 'gasTank') {
    return 'Gas Tank'
  }
  return networkName
}

const Option = ({
  renderIcon,
  text,
  onPress
}: {
  renderIcon: React.ReactNode
  text: string
  onPress: () => void
}) => {
  const { styles, theme } = useTheme(getStyles)
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }: any) => [
        styles.item,
        flexbox.justifySpaceBetween,
        {
          borderWidth: 1,
          borderColor: hovered ? theme.primary : 'transparent'
        }
      ]}
    >
      {({ hovered }: any) => (
        <>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <View
              style={{
                width: 40,
                height: 40,
                ...flexbox.center,
                ...spacings.mrTy
              }}
            >
              {renderIcon}
            </View>
            <Text fontSize={16} weight="medium">
              {text}
            </Text>
          </View>
          <RightArrowIcon
            style={{
              transform: [{ translateX: hovered ? 5 : 0 }]
            }}
          />
        </>
      )}
    </Pressable>
  )
}

interface Props {
  sheetRef: ReturnType<typeof useModalize>['ref']
  closeBottomSheet: () => void
  selectedNetworkId: NetworkDescriptor['id'] | null
  openBlockExplorer: (networkId: NetworkDescriptor['id'], url?: string) => void
}
const NetworkBottomSheet = ({
  sheetRef,
  closeBottomSheet,
  selectedNetworkId,
  openBlockExplorer
}: Props) => {
  const { addToast } = useToast()
  const { theme, styles } = useTheme(getStyles)
  const { networks } = useSettingsControllerState()
  const networkData = networks.find((network) => network.id === selectedNetworkId)

  if (!selectedNetworkId) return null

  return (
    <BottomSheet sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
      <View style={[styles.item, spacings.pvSm, spacings.mb3Xl]}>
        <NetworkIcon width={32} height={32} name={selectedNetworkId} />
        <Text fontSize={16} weight="medium" style={spacings.mlMi}>
          {getNetworkName(selectedNetworkId, networkData?.name)}
        </Text>
      </View>
      <Option
        renderIcon={<SettingsIcon width={27} height={27} color={theme.secondaryText} />}
        text="Go to Network Settings"
        onPress={async () => {
          try {
            await openInternalPageInTab(WEB_ROUTES.networksSettings)
          } catch {
            addToast('Failed to open network settings in a new tab.', { type: 'error' })
          }
        }}
      />
      <Option
        renderIcon={<OpenIcon width={20} height={20} color={theme.secondaryText} />}
        text="Open current account in blockexplorer"
        onPress={() => {
          openBlockExplorer(selectedNetworkId, networkData?.explorerUrl)
        }}
      />
    </BottomSheet>
  )
}

export default NetworkBottomSheet
