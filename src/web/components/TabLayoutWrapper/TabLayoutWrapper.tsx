import React, { ReactElement } from 'react'
import { ColorValue, View, ViewProps, ViewStyle } from 'react-native'

import Wrapper, { WrapperProps } from '@common/components/Wrapper'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

type Width = 'sm' | 'md' | 'lg' | 'full'

const { isTab } = getUiType()

export const tabLayoutWidths = {
  sm: 770,
  md: 900,
  lg: TAB_CONTENT_WIDTH,
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

export const TabLayoutContainer = ({
  backgroundColor,
  header,
  footer,
  hideFooterInPopup = false,
  width = 'full',
  children
}: TabLayoutContainerProps) => {
  const { theme, styles } = useTheme(getStyles)
  const isFooterHiddenInPopup = hideFooterInPopup && !isTab

  return (
    <View style={[flexbox.flex1, { backgroundColor: backgroundColor || theme.primaryBackground }]}>
      {!!header && header}
      <View
        style={[
          flexbox.directionRow,
          flexbox.flex1,
          width !== 'full' ? flexbox.alignSelfCenter : {},
          width === 'full' && isTab ? spacings.ph3Xl : {},
          width === 'full' && !isTab ? spacings.ph : {},
          {
            backgroundColor: backgroundColor || theme.primaryBackground,
            maxWidth: tabLayoutWidths[width],
            width: '100%'
          }
        ]}
      >
        {children}
      </View>
      {!!footer && !isFooterHiddenInPopup && <View style={styles.footerContainer}>{footer}</View>}
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

interface TabLayoutWrapperSideContentProps extends ViewProps {}

export const TabLayoutWrapperSideContent: React.FC<TabLayoutWrapperSideContentProps> = ({
  children,
  style
}: TabLayoutWrapperSideContentProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <View style={[styles.sideContentContainer, style]}>
      <Wrapper contentContainerStyle={[spacings.ph0]} showsVerticalScrollIndicator={false}>
        {children}
      </Wrapper>
    </View>
  )
}

interface TabLayoutWrapperSideContentItemProps extends ViewProps {
  type?: 'primary' | 'info' | 'error'
  children: ReactElement | ReactElement[]
  style?: ViewStyle
}

export const TabLayoutWrapperSideContentItem = ({
  type = 'primary',
  children,
  style,
  ...rest
}: TabLayoutWrapperSideContentItemProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <View
      style={[
        type === 'primary' && styles.primarySideItem,
        type === 'error' && styles.errorSideItem,
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
