import React, { useMemo } from 'react'
import { View } from 'react-native'

import FilterIcon from '@common/assets/svg/FilterIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, DURATIONS, useMultiHover } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isPopup } = getUiType()

const maxNetworkNameLengths = {
  popUp: 11,
  tab: 8
} as const

const SelectNetwork = () => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { dashboardNetworkFilter } = useSelectedAccountControllerState()
  const { navigate } = useNavigation()
  const { networks } = useNetworksControllerState()
  const { theme } = useTheme()

  const [bindNetworkButtonAnim, networkButtonAnimStyle] = useMultiHover({
    values: [
      {
        property: 'backgroundColor',
        from: theme.secondaryBackground,
        to: theme.tertiaryBackground,
        duration: DURATIONS.REGULAR
      },
      {
        property: 'borderColor',
        from: theme.secondaryBorder,
        to: theme.tertiaryText,
        duration: DURATIONS.REGULAR
      }
    ]
  })

  const filterByNetworkName = useMemo(() => {
    if (!dashboardNetworkFilter) return ''

    if (dashboardNetworkFilter === 'rewards') return t('Ambire Rewards Portfolio')
    if (dashboardNetworkFilter === 'gasTank') return t('Gas Tank Portfolio')

    const network = networks.find((n) => n.id === dashboardNetworkFilter)

    let networkName = network?.name ?? t('Unknown Network') ?? 'Unknown Network'

    const maxNetworkNameLength = maxNetworkNameLengths[isPopup ? 'popUp' : 'tab']

    if (networkName.length > maxNetworkNameLength) {
      networkName = `${networkName.slice(0, maxNetworkNameLength)}...`
    }

    networkName = `${networkName} ${!isPopup ? t('Portfolio') : ''}`

    return networkName
  }, [dashboardNetworkFilter, networks, t])

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        spacings.mrTy,
        {
          width: isPopup ? 160 : 190
        }
      ]}
    >
      <AnimatedPressable
        style={[
          styles.container,
          flexbox.directionRow,
          flexbox.justifySpaceBetween,
          flexbox.alignCenter,
          networkButtonAnimStyle,
          spacings.plTy,
          spacings.prTy,
          {
            ...(dashboardNetworkFilter && {
              color: theme.primaryText,
              borderColor: theme.primary,
              backgroundColor: theme.infoBackground
            })
          }
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
            <FilterIcon color={iconColors.dark} style={spacings.prTy} width={14} height={14} />
            <Text fontSize={14}>{filterByNetworkName}</Text>
          </View>
        ) : (
          <Text fontSize={14}>{t('All Networks')}</Text>
        )}
        <RightArrowIcon height={12} color={iconColors.dark} />
      </AnimatedPressable>
    </View>
  )
}

export default React.memo(SelectNetwork)
