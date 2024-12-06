import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

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
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import Option from '../Option'
import getStyles from './styles'

interface Props {
  sheetRef: ReturnType<typeof useModalize>['ref']
  closeBottomSheet: () => void

  openBlockExplorer: (url?: string) => void
}

const NetworkBottomSheet = ({ sheetRef, closeBottomSheet, openBlockExplorer }: Props) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { theme, styles } = useTheme(getStyles)
  const { networks } = useNetworksControllerState()
  const { dashboardNetworkFilter } = useSelectedAccountControllerState()
  const networkData = networks.find((network) => network.id === dashboardNetworkFilter)

  return (
    <BottomSheet
      id="dashboard-networks-network"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
    >
      <View style={[styles.item, spacings.pvSm, spacings.mb3Xl]}>
        {!!dashboardNetworkFilter && <NetworkIcon size={32} id={dashboardNetworkFilter} />}
        <Text fontSize={16} weight="medium" style={spacings.mlMi}>
          {networkData?.name || t('Unknown Network')}
        </Text>
      </View>
      <Option
        renderIcon={<SettingsIcon width={27} height={27} color={theme.secondaryText} />}
        title={t('Go to Network Settings')}
        onPress={() => {
          try {
            navigate(`${WEB_ROUTES.networksSettings}?networkId=${dashboardNetworkFilter}`)
          } catch {
            addToast(t('Failed to open network settings.'), { type: 'error' })
          }
        }}
      />
      <Option
        renderIcon={<OpenIcon width={20} height={20} color={theme.secondaryText} />}
        title={t('Open current account in block explorer')}
        onPress={() => {
          openBlockExplorer(networkData?.explorerUrl)
        }}
      />
    </BottomSheet>
  )
}

export default memo(NetworkBottomSheet)
