import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, FlatListProps, ViewStyle } from 'react-native'

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

const SCROLLBAR_TRIGGER_THRESHOLD = 4

const getFlatListStyle = (tab: TabType, openTab: TabType, allBannersLength: number) => [
  spacings.ph0,
  commonWebStyles.contentContainer,
  !allBannersLength && spacings.mtTy,
  openTab !== tab ? HIDDEN_STYLE : {}
]

const { isPopup } = getUiType()

const DashboardPageScrollContainer: FC<Props> = ({ tab, openTab, ...rest }) => {
  const [hasScrollBar, setHasScrollBar] = useState(false)
  const allBanners = useBanners()
  const flatlistRef = useRef<FlatList | null>(null)

  const style = useMemo(
    () => getFlatListStyle(tab, openTab, allBanners.length),
    [allBanners.length, openTab, tab]
  )

  const contentContainerStyle = useMemo(() => {
    const popUpHorizontalPadding = hasScrollBar ? spacings.phTy : spacings.phSm

    return [
      isPopup ? spacings.plSm : {},
      isPopup ? popUpHorizontalPadding : { paddingRight: 2 },
      allBanners.length ? spacings.ptTy : spacings.pt0,
      { flexGrow: 1 }
    ]
  }, [allBanners.length, hasScrollBar])

  useEffect(() => {
    if (!flatlistRef.current) return

    // Fixes weird behaviour that occurs when you scroll in one tab and then move to another and back.
    flatlistRef.current?.scrollToOffset({
      offset: 0,
      animated: false
    })
  }, [openTab])

  const handleContentSizeChange = useCallback((contentWidth: number) => {
    const windowWidth = Dimensions.get('window').width

    if (windowWidth - contentWidth > SCROLLBAR_TRIGGER_THRESHOLD) return

    setHasScrollBar(contentWidth < windowWidth)
  }, [])

  return (
    <FlatList
      ref={flatlistRef}
      style={style}
      contentContainerStyle={contentContainerStyle}
      stickyHeaderIndices={[1]} // Makes the header sticky
      removeClippedSubviews
      bounces={false}
      alwaysBounceVertical={false}
      onContentSizeChange={handleContentSizeChange}
      {...rest}
    />
  )
}

export default DashboardPageScrollContainer
