import React, { createContext, useContext } from 'react'
import { View } from 'react-native'
import { Outlet } from 'react-router-dom'

import {
  headerAlpha as defaultHeaderAlpha,
  headerBeta as defaultHeaderBeta,
  headerGamma as defaultHeaderGamma
} from '@common/modules/header/config/headerConfig'
import flexbox from '@common/styles/utils/flexbox'

const AuthLayoutWrapperContext = createContext(true)

export const AuthLayoutWrapperMainContent: React.FC<any> = ({ children }) => {
  const context = useContext(AuthLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return (
    <View style={flexbox.flex1}>
      {defaultHeaderBeta({})}
      {children}
    </View>
  )
}

const AuthLayoutWrapper = (
  <AuthLayoutWrapperContext.Provider value={true}>
    <View style={[flexbox.directionRow, flexbox.flex1]}>
      <Outlet />
    </View>
  </AuthLayoutWrapperContext.Provider>
)

export const AuthLayoutWrapperSideContent: React.FC<any> = ({ children }) => {
  const context = useContext(AuthLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return <View style={{ backgroundColor: 'green', width: 500 }}>{children}</View>
}

export default AuthLayoutWrapper
