import React from 'react'
import { Pressable, View } from 'react-native'

import BridgeIcon from '@common/assets/svg/BridgeIcon'
import DAppsIcon from '@common/assets/svg/DAppsIcon'
import ReceiveIcon from '@common/assets/svg/ReceiveIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { BRIDGE_URL } from '@common/constants/externalDAppUrls'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'

import { NEUTRAL_BACKGROUND, NEUTRAL_BACKGROUND_HOVERED } from '../../screens/styles'

const Routes = ({
  setIsReceiveModalVisible
}: {
  setIsReceiveModalVisible: (isOpen: boolean) => void
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { addToast } = useToast()

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
        <Pressable
          key={routeItem.label}
          style={[flexbox.alignCenter, index !== routeItems.length - 1 && spacings.mr]}
          disabled={routeItem.disabled}
          onPress={async () => {
            if (routeItem?.onPress) {
              routeItem.onPress()
              return
            }

            if (routeItem.isExternal) {
              try {
                await createTab(routeItem.route)
              } catch {
                addToast(t('Failed to open new tab.'), { type: 'error' })
              }
              return
            }
            navigate(routeItem.route)
          }}
        >
          {({ hovered }: any) => (
            <>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: BORDER_RADIUS_PRIMARY,
                  backgroundColor: hovered ? NEUTRAL_BACKGROUND_HOVERED : NEUTRAL_BACKGROUND,
                  ...flexbox.center,
                  opacity: routeItem.disabled ? 0.4 : 1,
                  ...spacings.mbTy
                }}
              >
                <routeItem.icon
                  style={{
                    opacity: hovered ? 1 : 0.7,
                    transform: [{ scale: hovered ? 1.2 : 1 }]
                  }}
                  color={theme.primaryBackground}
                  width={26}
                  height={26}
                />
              </View>
              <Text
                color={theme.primaryBackground}
                weight="regular"
                fontSize={12}
                style={routeItem.disabled && { opacity: 0.4 }}
              >
                {routeItem.label}
              </Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  )
}

export default Routes
