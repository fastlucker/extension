import React from 'react'
import { View } from 'react-native'

import BridgeIcon from '@common/assets/svg/BridgeIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const Routes = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const routeItems = [
    { icon: SwapIcon, label: t('Swap'), route: 'swapRoute' },
    { icon: BridgeIcon, label: t('Bridge'), route: 'bridgeRoute' },
    { icon: SendIcon, label: t('Send'), route: WEB_ROUTES.transfer },
    { icon: TopUpIcon, label: t('Top up'), route: 'topUpRoute' },
    { icon: EarnIcon, label: t('Earn'), route: 'earnRoute' }
  ]

  return (
    <View style={[flexbox.directionRow]}>
      {routeItems.map((routeItem, index) => (
        <View
          key={routeItem.label}
          style={[flexbox.alignCenter, index !== routeItems.length - 1 && spacings.mrTy]}
        >
          <NavIconWrapper
            onPress={() => {
              navigate(routeItem.route)
              console.log(`Navigating to: ${routeItem.route}`)
            }}
            hoverBackground={theme.primary}
            hoverColor={colors.white}
            style={{
              backgroundColor: colors.melrose_35,
              borderColor: theme.primary,
              ...spacings.mbMi
            }}
          >
            <routeItem.icon width={20} height={20} />
          </NavIconWrapper>
          <Text weight="regular" shouldScale={false} fontSize={12}>
            {routeItem.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default Routes
