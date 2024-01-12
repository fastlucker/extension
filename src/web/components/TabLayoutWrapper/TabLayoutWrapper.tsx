import React, { ReactElement } from 'react'
import { ColorValue, View } from 'react-native'

import Wrapper, { WrapperProps } from '@common/components/Wrapper'
import useTheme from '@common/hooks/useTheme'
import spacings, {
  IS_SCREEN_SIZE_DESKTOP_LARGE,
  SPACING_3XL,
  SPACING_XL
} from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TAB_CONTENT_WIDTH, TAB_WIDE_CONTENT_WIDTH } from '@web/constants/spacings'
import { getUiType } from '@web/utils/uiType'

import TabLayoutWrapperSideContent from './SideContent'
import TabLayoutWrapperSideContentItem from './SideContentItem/SideContentItem'
import getStyles from './styles'

type Width = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const { isTab, isNotification } = getUiType()

export const tabLayoutWidths = {
  sm: 770,
  md: 900,
  lg: TAB_CONTENT_WIDTH,
  xl: TAB_WIDE_CONTENT_WIDTH,
  full: '100%'
}

type TabLayoutContainerProps = {
  backgroundColor?: ColorValue
  header?: React.ReactNode
  footer?: React.ReactNode
  hideFooterInPopup?: boolean
  width?: Width
  children: ReactElement | ReactElement[]
}

export const paddingHorizontalStyle =
  isTab || isNotification
    ? {
        paddingHorizontal: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_3XL : SPACING_XL
      }
    : spacings.ph

export const TabLayoutContainer = ({
  backgroundColor,
  header,
  footer,
  hideFooterInPopup = false,
  width = 'xl',
  children
}: TabLayoutContainerProps) => {
  const { theme, styles } = useTheme(getStyles)
  const isFooterHiddenInPopup = hideFooterInPopup && !isTab

  return (
    <View style={[flexbox.flex1, { backgroundColor: backgroundColor || theme.primaryBackground }]}>
      {!!header && header}
      <View style={[flexbox.flex1, paddingHorizontalStyle]}>
        <View
          style={[
            flexbox.directionRow,
            flexbox.flex1,
            width !== 'full' ? flexbox.alignSelfCenter : {},
            {
              backgroundColor: backgroundColor || theme.primaryBackground,
              maxWidth: tabLayoutWidths[width],
              width: '100%'
            }
          ]}
        >
          {children}
        </View>
      </View>
      {!!footer && !isFooterHiddenInPopup && (
        <View style={[styles.footerContainer, paddingHorizontalStyle]}>
          <View style={styles.footer}>{footer}</View>
        </View>
      )}
    </View>
  )
}

interface TabLayoutWrapperMainContentProps extends WrapperProps {
  children: React.ReactNode
  wrapperRef?: any
}

export const TabLayoutWrapperMainContent: React.FC<TabLayoutWrapperMainContentProps> = ({
  children,
  wrapperRef,
  contentContainerStyle = {},
  ...rest
}: TabLayoutWrapperMainContentProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <Wrapper
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      wrapperRef={wrapperRef}
      {...rest}
    >
      {children}
    </Wrapper>
  )
}

export { TabLayoutWrapperSideContent, TabLayoutWrapperSideContentItem }
