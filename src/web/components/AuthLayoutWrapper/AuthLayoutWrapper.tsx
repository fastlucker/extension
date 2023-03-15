import React, { createContext, useContext } from 'react'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

const AuthLayoutWrapperContext = createContext(true)

const AuthLayoutWrapper: React.FC<any> = ({ children }) => {
  return (
    <AuthLayoutWrapperContext.Provider value={true}>
      <View style={flexbox.directionRow}>{children}</View>
    </AuthLayoutWrapperContext.Provider>
  )
}

const MainContent: React.FC<any> = ({ children }) => {
  const context = useContext(AuthLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return <View style={flexbox.flex1}>{children}</View>
}

const SideContent: React.FC<any> = ({ children }) => {
  const context = useContext(AuthLayoutWrapperContext)

  if (!context) {
    throw new Error('Should be used in AuthLayoutWrapper component!')
  }

  return <View style={{ backgroundColor: 'green', width: 500 }}>{children}</View>
}

AuthLayoutWrapper.SideContent = SideContent
AuthLayoutWrapper.MainContent = MainContent

export default AuthLayoutWrapper
