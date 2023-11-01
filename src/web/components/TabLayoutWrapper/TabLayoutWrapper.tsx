import { LinearGradient } from 'expo-linear-gradient'
import React, { createContext, useContext } from 'react'
import { View, ViewProps } from 'react-native'
import { Outlet } from 'react-router-dom'

import InformationCircleIcon from '@common/assets/svg/InformationCircleIcon'
import Wrapper from '@common/components/Wrapper'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import Ameba from '@web/components/TabLayoutWrapper/Ameba'
import TabHeader from '@web/modules/router/components/TabHeader'

import styles from './styles'

const TabLayoutWrapperContext = createContext(true)

const TabLayoutWrapper = (
  <TabLayoutWrapperContext.Provider value>
    <View style={[flexbox.directionRow, flexbox.flex1]}>
      <Outlet />
    </View>
  </TabLayoutWrapperContext.Provider>
)

type Width = 'sm' | 'md' | 'lg' | 'full'

interface Props {
  width?: Width
  hideStepper?: boolean
  hideHeader?: boolean
  pageTitle?: string | React.ReactNode
  children: React.ReactNode
  forceCanGoBack?: boolean
  onBack?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
}

const widthConf = {
  sm: 770,
  md: 900,
  lg: 1000,
  full: '100%'
}

export const TabLayoutWrapperMainContent: React.FC<Props> = ({
  width = 'sm',
  hideStepper = false,
  hideHeader = false,
  pageTitle = '',
  children,
  forceCanGoBack,
  onBack,
  header,
  footer
}: Props) => {
  const context = useContext(TabLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return (
    <View style={[flexbox.flex1, { backgroundColor: colors.white }]}>
      {!hideHeader &&
        (header || (
          <TabHeader
            pageTitle={pageTitle}
            hideStepper={hideStepper}
            forceCanGoBack={forceCanGoBack}
            onBack={onBack}
          />
        ))}
      <Wrapper
        style={[flexbox.flex1]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            flexbox.alignSelfCenter,
            // Here, we set height: '100%' to enable the inner ScrollView within the Wrapper to have a scrollable content.
            // You can observe how the SignScreen utilizes an inner ScrollView component to display the transaction.
            // This should not have any impact on the other screens.
            { maxWidth: widthConf[width], width: '100%', height: '100%' }
          ]}
        >
          {children}
        </View>
      </Wrapper>
      <View style={styles.footerContainer}>{footer}</View>
    </View>
  )
}

interface TabLayoutWrapperSideContentProps extends ViewProps {
  backgroundType?: 'alpha' | 'beta'
}

export const TabLayoutWrapperSideContent: React.FC<TabLayoutWrapperSideContentProps> = ({
  backgroundType = 'alpha',
  children,
  style,
  ...rest
}) => {
  const context = useContext(TabLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return (
    <LinearGradient
      colors={['#2CC6A7', '#420C9F', '#292150']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.53, 1]}
      style={[styles.sideContentContainer, style]}
      {...rest}
    >
      <Wrapper
        contentContainerStyle={[spacings.ph0, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        <InformationCircleIcon style={styles.informationCircle} />
        {children}
      </Wrapper>
      <Ameba style={backgroundType === 'alpha' ? styles.amebaAlpha : styles.amebaBeta} />
    </LinearGradient>
  )
}

export default TabLayoutWrapper
