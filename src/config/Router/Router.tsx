import React from 'react'
import { useTranslation } from 'react-i18next'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'
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
    backgroundColor: colors.headerBackgroundColor,
    shadowColor: colors.headerShadowColor
  },
  headerTintColor: colors.headerTintColor,
  headerTitleStyle: {
    fontSize: 20
  },
  headerBackTitleVisible: false
}

const TAB_BAR_ICON_SIZE = 22

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

const AppStack = () => {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActiveTintColor,
        tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
        tabBarInactiveBackgroundColor: colors.tabBarInactiveBackgroundColor,
        tabBarActiveBackgroundColor: colors.tabBarActiveBackgroundColor,
        tabBarStyle: {
          backgroundColor: colors.tabBarInactiveBackgroundColor,
          borderTopColor: colors.headerShadowColor
        },
        tabBarLabelStyle: {
          paddingBottom: 5
        },
        ...globalScreenOptions
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: t('Dashboard'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={DashboardScreen}
      />
      <Stack.Screen
        name="transactions"
        options={{
          title: t('Transactions'),
          // Use this one, because the actual one is <BiTransfer />,
          // but the Box Icons set is not available
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="send-and-archive" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={TransactionsScreen}
      />
      <Stack.Screen
        name="earn"
        options={{
          title: t('Earn'),
          tabBarIcon: ({ color }) => (
            // Use this one, because the actual one is <BsPiggyBank />,
            // but the Bootstrap Icons set is not available
            <MaterialIcons name="attach-money" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={EarnScreen}
      />
      <Stack.Screen
        name="send"
        options={{
          title: t('Send'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare-arrows" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={SendScreen}
      />
      <Stack.Screen
        name="apps"
        options={{
          title: t('Apps'),
          // Missing in the web app, so the icon here is mobile app specific
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-apps" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={AppsScreen}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: t('Settings'),
          // Missing in the web app, so the icon here is mobile app specific
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  )
}

const Router = () => {
  const { isAuthenticated } = useAuth()
  return <NavigationContainer>{isAuthenticated ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

export default Router
