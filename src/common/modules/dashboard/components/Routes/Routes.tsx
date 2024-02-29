import React from 'react'
import { View } from 'react-native'

import BridgeIcon from '@common/assets/svg/BridgeIcon'
import DAppsIcon from '@common/assets/svg/DAppsIcon'
import ReceiveIcon from '@common/assets/svg/ReceiveIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import { useTranslation } from '@common/config/localization'
import { BRIDGE_URL } from '@common/constants/externalDAppUrls'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import flexbox from '@common/styles/utils/flexbox'

import RouteItem from './RouteItem'

const Routes = ({
  setIsReceiveModalVisible
}: {
  setIsReceiveModalVisible: (isOpen: boolean) => void
}) => {
  const { t } = useTranslation()

  const routeItems = [
    { icon: SendIcon, label: t('Send'), route: WEB_ROUTES.transfer, isExternal: false },
    {
      icon: ReceiveIcon,
      label: t('Receive'),
      onPress: () => setIsReceiveModalVisible(true),
      isExternal: false
    },
    { icon: SwapIcon, label: t('Swap'), route: 'https://app.uniswap.org/swap', isExternal: true },
    {
      icon: BridgeIcon,
      label: t('Bridge'),
      route: BRIDGE_URL,
      isExternal: true
    },
    {
      icon: DAppsIcon,
      label: t('dApps'),
      route: '',
      isExternal: true,
      disabled: true
    }
  ]

  return (
    <View style={[flexbox.directionRow]}>
      {routeItems.map((routeItem, index) => (
        <RouteItem
          key={routeItem.label}
          routeItem={routeItem}
          index={index}
          routeItemsLength={routeItems.length}
        />
      ))}
    </View>
  )
}

export default React.memo(Routes)
