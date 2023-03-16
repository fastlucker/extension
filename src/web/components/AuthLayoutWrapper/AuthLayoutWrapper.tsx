import { LinearGradient } from 'expo-linear-gradient'
import React, { createContext, useContext } from 'react'
import { View } from 'react-native'
import { Outlet } from 'react-router-dom'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import TabHeader from '@web/modules/router/components/TabHeader'

const AuthLayoutWrapperContext = createContext(true)

const AuthLayoutWrapper = (
  <AuthLayoutWrapperContext.Provider value={true}>
    <View style={[flexbox.directionRow, flexbox.flex1]}>
      <Outlet />
    </View>
  </AuthLayoutWrapperContext.Provider>
)

export const AuthLayoutWrapperMainContent: React.FC<any> = ({ children }) => {
  const context = useContext(AuthLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return (
    <View style={[flexbox.flex1, { backgroundColor: colors.zircon }]}>
      <TabHeader />
      <View style={[spacings.pbLg, spacings.phLg, { marginTop: 180 }]}>{children}</View>
    </View>
  )
}

export const AuthLayoutWrapperSideContent: React.FC<any> = ({ children }) => {
  const context = useContext(AuthLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return (
    <LinearGradient
      colors={['#ae60ff', '#28e7a7']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[{ width: '33%', paddingTop: 80, paddingHorizontal: 60 }]}
    >
      {children}
    </LinearGradient>
  )
}

export default AuthLayoutWrapper
