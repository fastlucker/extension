import React from 'react'
import { useTranslation } from 'react-i18next'

import AppsScreen from '@modules/apps/screens/AppsScreen'
import useAuth from '@modules/auth/hooks/useAuth'
import AddNewAccountScreen from '@modules/auth/screens/AddNewAccountScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import colors from '@modules/common/styles/colors'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import SettingsScreen from '@modules/settings/screens/SettingsScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const globalScreenOptions = {
  headerStyle: {
    backgroundColor: colors.headerBackgroundColor
  },
  headerTintColor: colors.headerTintColor
}

const AuthStack = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="addNewAccount"
        options={{ title: t('Register') }}
        component={AddNewAccountScreen}
      />
      <Stack.Screen
        name="emailLogin"
        options={{ title: t('Login') }}
        component={EmailLoginScreen}
      />
      <Stack.Screen name="jsonLogin" options={{ title: t('Login') }} component={JsonLoginScreen} />
      <Stack.Screen
        name="qrCodeLogin"
        options={{ title: t('Login') }}
        component={QRCodeLoginScreen}
      />
    </Stack.Navigator>
  )
}

const AppStack = () => (
  <Tab.Navigator>
    <Stack.Screen name="dashboard" component={DashboardScreen} />
    <Stack.Screen name="transactions" component={TransactionsScreen} />
    <Stack.Screen name="earn" component={EarnScreen} />
    <Stack.Screen name="send" component={SendScreen} />
    <Stack.Screen name="apps" component={AppsScreen} />
    <Stack.Screen name="settings" component={SettingsScreen} />
  </Tab.Navigator>
)

const Router = () => {
  const { isAuthenticated } = useAuth()
  return <NavigationContainer>{isAuthenticated ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

export default Router
