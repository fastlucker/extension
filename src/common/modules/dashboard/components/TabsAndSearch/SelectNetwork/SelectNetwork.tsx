import React, { useMemo } from 'react'
import { View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isPopup } = getUiType()

const SelectNetwork = () => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { dashboardNetworkFilter } = useSelectedAccountControllerState()
  const { navigate } = useNavigation()
  const { networks } = useNetworksControllerState()
  const { theme } = useTheme()

  const [bindNetworkButtonAnim, networkButtonAnimStyle] = useHover({
    preset: 'opacity'
  })

  const filterByNetworkName = useMemo(() => {
    if (!dashboardNetworkFilter) return ''

    if (dashboardNetworkFilter === 'rewards') return 'Ambire Rewards Portfolio'
    if (dashboardNetworkFilter === 'gasTank') return 'Gas Tank Portfolio'

    const network = networks.find((n) => n.id === dashboardNetworkFilter)

    let networkName = network?.name || 'Unknown Network'

    networkName = `${networkName} Portfolio`

    if (networkName.length > 20 && isPopup) {
      networkName = `${networkName.slice(0, 20)}...`
    }

    return networkName
  }, [dashboardNetworkFilter, networks])

  return (
    <View style={[styles.container, flexbox.directionRow, flexbox.alignCenter, spacings.mrTy]}>
      <AnimatedPressable
        style={[
          flexbox.directionRow,
          flexbox.justifySpaceBetween,
          flexbox.alignCenter,
          networkButtonAnimStyle,
          spacings.plTy,
          spacings.prTy,
          { width: '100%' }
        ]}
        onPress={() => {
          navigate(WEB_ROUTES.networks, {
            state: {
              dashboardNetworkFilter,
              prevTab: window.location.hash.split('?')[1] || ''
            }
          })
        }}
        {...bindNetworkButtonAnim}
      >
        {dashboardNetworkFilter ? (
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <FilterIcon width={12} height={12} />
            <Text fontSize={12}>{filterByNetworkName}</Text>
          </View>
        ) : (
          <Text fontSize={14}>{t('All Networks')}</Text>
        )}
        <DownArrowIcon color={theme.primaryText} width={12} height={6.5} />
      </AnimatedPressable>
    </View>
  )
}

export default React.memo(SelectNetwork)
