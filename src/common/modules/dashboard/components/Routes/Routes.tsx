import React from 'react'
import { View } from 'react-native'

import BridgeIcon from '@common/assets/svg/BridgeIcon'
import ReceiveIcon from '@common/assets/svg/ReceiveIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'

const Routes = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const routeItems = [
    { icon: SendIcon, label: t('Send'), route: WEB_ROUTES.transfer, isExternal: false },
    { icon: ReceiveIcon, label: t('Receive'), route: 'receiveRoute', isExternal: false },
    { icon: SwapIcon, label: t('Swap'), route: 'https://app.uniswap.org/swap', isExternal: true },
    {
      icon: BridgeIcon,
      label: t('Bridge'),
      route: 'https://www.bungee.exchange/',
      isExternal: true
    }
  ]

  return (
    <View style={[flexbox.directionRow]}>
      {routeItems.map((routeItem, index) => (
        <View
          key={routeItem.label}
          style={[flexbox.alignCenter, index !== routeItems.length - 1 && spacings.mrMd]}
        >
          <NavIconWrapper
            onPress={() => {
              if (routeItem.isExternal) {
                createTab(routeItem.route)
                return
              }
              navigate(routeItem.route)
            }}
            hoverBackground="transparent"
            hoverColor={theme.primary}
            style={{
              borderColor: theme.primary,
              borderWidth: 2,
              ...spacings.mbMi,
              backgroundColor: 'transparent'
            }}
          >
            <routeItem.icon color={theme.primary} width={24} height={24} />
          </NavIconWrapper>
          <Text weight="regular" fontSize={14}>
            {routeItem.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default Routes
