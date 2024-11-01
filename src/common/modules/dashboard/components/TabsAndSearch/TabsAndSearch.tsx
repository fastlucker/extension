import { TFunction } from 'i18next'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Search from '@common/components/Search'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import Tabs from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tabs'
import useBanners from '@common/modules/dashboard/hooks/useBanners'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
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
  const { t } = useTranslation()
  const allBanners = useBanners()

  return (
    <View style={[styles.container, !!allBanners.length && spacings.ptTy]}>
      <Tabs handleChangeQuery={handleChangeQuery} setOpenTab={setOpenTab} openTab={openTab} />
      {['tokens', 'collectibles'].includes(openTab) && (
        <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
          <SelectNetwork />
          <Search
            containerStyle={{ flex: 1, maxWidth: isPopup ? 184 : 212 }}
            control={searchControl}
            height={32}
            placeholder={getSearchPlaceholder(openTab, t)}
          />
        </View>
      )}
    </View>
  )
}

export default React.memo(TabsAndSearch)
