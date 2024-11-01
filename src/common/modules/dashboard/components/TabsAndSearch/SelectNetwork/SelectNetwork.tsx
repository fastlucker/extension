import React, { useMemo } from 'react'
import { View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isPopup } = getUiType()

const SelectNetwork = () => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const route = useRoute()
  const { navigate } = useNavigation()
  const { networks } = useNetworksControllerState()
  const { theme } = useTheme()

  const [bindNetworkButtonAnim, networkButtonAnimStyle] = useHover({
    preset: 'opacity'
  })

  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const filterByNetworkName = useMemo(() => {
    if (!filterByNetworkId) return ''

    if (filterByNetworkId === 'rewards') return 'Ambire Rewards Portfolio'
    if (filterByNetworkId === 'gasTank') return 'Gas Tank Portfolio'

    const network = networks.find((n) => n.id === filterByNetworkId)

    let networkName = network?.name || 'Unknown Network'

    networkName = `${networkName} Portfolio`

    if (networkName.length > 20 && isPopup) {
      networkName = `${networkName.slice(0, 20)}...`
    }

    return networkName
  }, [filterByNetworkId, networks])

  return (
    <View style={[styles.container, flexbox.directionRow, flexbox.alignCenter, spacings.mrSm]}>
      <AnimatedPressable
        style={[
          flexbox.directionRow,
          flexbox.justifySpaceBetween,
          flexbox.alignCenter,
          networkButtonAnimStyle,
          spacings.plSm,
          spacings.prSm,
          { width: '100%' }
        ]}
        onPress={() => {
          navigate(WEB_ROUTES.networks, {
            state: {
              filterByNetworkId,
              prevTab: window.location.hash.split('?')[1] || ''
            }
          })
        }}
        {...bindNetworkButtonAnim}
      >
        {filterByNetworkId ? (
          <FilterIcon color={theme.primaryBackground} width={16} height={16} />
        ) : null}
        <Text fontSize={14} color={theme.primaryText}>
          {filterByNetworkId ? filterByNetworkName : t('All Networks')}
        </Text>
        <DownArrowIcon color={theme.primaryText} width={12} height={6.5} />
      </AnimatedPressable>
    </View>
  )
}

export default React.memo(SelectNetwork)
