import React, { FC, useEffect, useMemo, useRef } from 'react'
import { FlatList, FlatListProps, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import commonWebStyles from '@web/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

import useBanners from '../../hooks/useBanners'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'

interface Props extends FlatListProps<any> {
  tab: TabType
  openTab: TabType
}

// We do this instead of unmounting the component to prevent component rerendering when switching tabs.
const HIDDEN_STYLE: ViewStyle = {
  position: 'absolute',
  opacity: 0,
  display: 'none',
  // @ts-ignore
  pointerEvents: 'none'
}

const getFlatListStyle = (tab: TabType, openTab: TabType, allBannersLength: number) => [
  spacings.ph0,
  commonWebStyles.contentContainer,
  !allBannersLength && spacings.mtTy,
  openTab !== tab ? HIDDEN_STYLE : {}
]

const { isPopup } = getUiType()

const DashboardPageScrollContainer: FC<Props> = ({ tab, openTab, ...rest }) => {
  const allBanners = useBanners()
  const flatlistRef = useRef<FlatList | null>(null)

  const style = useMemo(
    () => getFlatListStyle(tab, openTab, allBanners.length),
    [allBanners.length, openTab, tab]
  )

  const contentContainerStyle = useMemo(
    () => [
      isPopup ? spacings.phSm : { paddingRight: 2 },
      allBanners.length ? spacings.ptTy : spacings.pt0,
      { flexGrow: 1 }
    ],
    [allBanners.length]
  )

  useEffect(() => {
    if (!flatlistRef.current) return

    // Fixes weird behaviour that occurs when you scroll in one tab and then move to another and back.
    flatlistRef.current?.scrollToOffset({
      offset: 0,
      animated: false
    })
  }, [openTab])

  return (
    <FlatList
      ref={flatlistRef}
      style={style}
      contentContainerStyle={contentContainerStyle}
      stickyHeaderIndices={[1]} // Makes the header sticky
      removeClippedSubviews
      bounces={false}
      alwaysBounceVertical={false}
      {...rest}
    />
  )
}

export default DashboardPageScrollContainer
