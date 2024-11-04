import { TFunction } from 'i18next'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import SearchIcon from '@common/assets/svg/SearchIcon'
// import Button from '@common/components/Button'
import Search from '@common/components/Search'
import useTheme from '@common/hooks/useTheme'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import Tabs from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tabs'
import useBanners from '@common/modules/dashboard/hooks/useBanners'
import spacings from '@common/styles/spacings'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import DURATIONS from '@web/hooks/useHover/durations'
import { getUiType } from '@web/utils/uiType'

import SelectNetwork from './SelectNetwork'
import styles from './styles'

const { isPopup } = getUiType()

const getSearchPlaceholder = (openTab: TabType, t: TFunction) => {
  if (isPopup) {
    return t('Search')
  }

  return openTab === 'tokens' ? t('Search for tokens') : t('Search for NFTs')
}

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  searchControl: any
}

// We want to change the query param without refreshing the page.
const handleChangeQuery = (tab: string) => {
  if (window.location.href.includes('?tab=')) {
    window.history.pushState(null, '', `${window.location.href.split('?')[0]}?tab=${tab}`)
    return
  }

  window.history.pushState(null, '', `${window.location.href}?tab=${tab}`)
}

const TabsAndSearch: FC<Props> = ({ openTab, setOpenTab, searchControl }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const allBanners = useBanners()
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [bindControlPositionAnim, controlPositionStyles] = useMultiHover({
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

  return (
    <View style={[styles.container, !!allBanners.length && spacings.ptTy]}>
      <Tabs handleChangeQuery={handleChangeQuery} setOpenTab={setOpenTab} openTab={openTab} />
      {['tokens', 'collectibles'].includes(openTab) && (
        <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
          <SelectNetwork />
          <AnimatedPressable
            onPress={() => setIsSearchVisible((prev) => !prev)}
            style={[
              flexbox.center,
              {
                height: 32,
                width: 32,
                borderRadius: BORDER_RADIUS_PRIMARY,
                borderWidth: 1,
                borderColor: theme.secondaryBorder,
                backgroundColor: theme.secondaryBackground
              },
              controlPositionStyles,
              {
                ...(isSearchVisible && {
                  borderColor: theme.primary,
                  backgroundColor: theme.infoBackground
                })
              }
            ]}
            onHoverIn={bindControlPositionAnim.onHoverIn}
            onHoverOut={bindControlPositionAnim.onHoverOut}
          >
            <SearchIcon color={theme.tertiaryText} width={16} />
          </AnimatedPressable>
          {isSearchVisible && (
            <Search
              containerStyle={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 5,
                zIndex: 10,
                borderWidth: 1,
                borderColor: theme.primaryBorder,
                ...common.borderRadiusPrimary,
                ...common.shadowPrimary
              }}
              inputWrapperStyle={{
                backgroundColor: theme.primaryBackground,
                borderWidth: 0,
                borderRadius: 0
              }}
              control={searchControl}
              height={32}
              placeholder={getSearchPlaceholder(openTab, t)}
              hasLeftIcon={false}
            />
          )}
        </View>
      )}
    </View>
  )
}

export default React.memo(TabsAndSearch)
