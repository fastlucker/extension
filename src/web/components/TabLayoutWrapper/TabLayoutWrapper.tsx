import React, { ReactElement, useMemo } from 'react'
import { ColorValue, View, ViewStyle } from 'react-native'

import Wrapper, { WrapperProps } from '@common/components/Wrapper'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_3XL, SPACING_XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TAB_CONTENT_WIDTH, TAB_WIDE_CONTENT_WIDTH } from '@web/constants/spacings'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

type Width = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const { isTab, isNotification } = getUiType()

export const tabLayoutWidths = {
  sm: 420,
  md: 830,
  lg: TAB_CONTENT_WIDTH,
  xl: TAB_WIDE_CONTENT_WIDTH,
  full: '100%'
}

type TabLayoutContainerProps = {
  backgroundColor?: ColorValue
  header?: React.ReactNode
  footer?: React.ReactNode
  footerStyle?: ViewStyle
  hideFooterInPopup?: boolean
  width?: Width
  children: ReactElement | ReactElement[]
  style?: ViewStyle
  withHorizontalPadding?: boolean
}

export const TabLayoutContainer = ({
  backgroundColor,
  header,
  footer,
  footerStyle,
  hideFooterInPopup = false,
  width = 'xl',
  children,
  style,
  withHorizontalPadding = true
}: TabLayoutContainerProps) => {
  const { theme, styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const isFooterHiddenInPopup = hideFooterInPopup && !isTab

  const paddingHorizontalStyle = useMemo(() => {
    if (isTab || isNotification) {
      return {
        paddingHorizontal: maxWidthSize('xl') ? SPACING_3XL : SPACING_XL
      }
    }

    return spacings.ph
  }, [maxWidthSize])

  return (
    <View style={[flexbox.flex1, { backgroundColor: backgroundColor || theme.primaryBackground }]}>
      {!!header && header}
      <View style={[flexbox.flex1, withHorizontalPadding && paddingHorizontalStyle]}>
        <View
          style={[
            flexbox.directionRow,
            flexbox.flex1,
            width !== 'full' ? flexbox.alignSelfCenter : {},
            {
              backgroundColor: backgroundColor || theme.primaryBackground,
              maxWidth: tabLayoutWidths[width],
              width: '100%'
            },
            style
          ]}
        >
          {children}
        </View>
      </View>
      {!!footer && !isFooterHiddenInPopup && (
        <View style={[styles.footerContainer, paddingHorizontalStyle]}>
          <View
            style={[
              styles.footer,
              {
                // Must be TAB_WIDE_CONTENT_WIDTH for every width except 'full'
                maxWidth: width === 'full' ? '100%' : TAB_WIDE_CONTENT_WIDTH
              },
              footerStyle
            ]}
          >
            {footer}
          </View>
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
