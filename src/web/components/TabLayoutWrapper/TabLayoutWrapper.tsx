import React from 'react'
import { ColorValue, View, ViewProps } from 'react-native'

import Wrapper from '@common/components/Wrapper'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type Width = 'sm' | 'md' | 'lg' | 'full'

export const tabLayoutWidths = {
  sm: 770,
  md: 900,
  lg: 1000,
  full: '100%'
}

type TabLayoutContainerProps = {
  backgroundColor?: ColorValue
  header?: React.ReactNode
  footer?: React.ReactNode
  width?: Width
  children: any
}

export const TabLayoutContainer = ({
  backgroundColor,
  header,
  footer,
  width = 'full',
  children
}: TabLayoutContainerProps) => {
  const { theme, styles } = useTheme(getStyles)
  return (
    <View
      style={[
        flexbox.flex1,
        width !== 'full' && flexbox.alignCenter,
        { backgroundColor: backgroundColor || theme.primaryBackground }
      ]}
    >
      {!!header && header}
      <View
        style={[
          flexbox.directionRow,
          flexbox.flex1,
          width === 'full' ? spacings.ph3Xl : {},
          {
            backgroundColor: backgroundColor || theme.primaryBackground,
            maxWidth: tabLayoutWidths[width]
          }
        ]}
      >
        {children}
      </View>
      {!!footer && <View style={styles.footerContainer}>{footer}</View>}
    </View>
  )
}

interface TabLayoutWrapperMainContentProps {
  children: React.ReactNode
}

export const TabLayoutWrapperMainContent: React.FC<TabLayoutWrapperMainContentProps> = ({
  children
}: TabLayoutWrapperMainContentProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <Wrapper contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
  children: any
}

export const TabLayoutWrapperSideContentItem = ({
  type = 'primary',
  children,
  ...rest
}: TabLayoutWrapperSideContentItemProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <View style={type === 'primary' && styles.primarySideItem} {...rest}>
      {children}
    </View>
  )
}
