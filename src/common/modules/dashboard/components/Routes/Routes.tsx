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

const Routes = ({ openReceiveModal }: { openReceiveModal: () => void }) => {
  const { t } = useTranslation()

  const routeItems = [
    {
      testID: 'dashboard-button-send',
      icon: SendIcon,
      label: t('Send'),
      route: WEB_ROUTES.transfer,
      isExternal: false
    },
    {
      testID: 'dashboard-button-receive',
      icon: ReceiveIcon,
      label: t('Receive'),
      onPress: openReceiveModal,
      isExternal: false
    },
    {
      testID: 'dashboard-button-swap',
      icon: SwapIcon,
      label: t('Swap & Bridge'),
      route: WEB_ROUTES.swapAndBridge,
      isExternal: false
    },
    {
      testID: 'dashboard-button-dapps',
      icon: DAppsIcon,
      label: t('dApps'),
      route: WEB_ROUTES.dappCatalog,
      isExternal: false
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
