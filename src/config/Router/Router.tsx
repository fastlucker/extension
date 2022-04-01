import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import BurgerIcon from '@assets/svg/BurgerIcon'
import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import DrawerContent from '@config/Router/DrawerContent'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import AddNewAccountScreen from '@modules/auth/screens/AddNewAccountScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import usePasscode from '@modules/common/hooks/usePasscode'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import { navigationRef, routeNameRef } from '@modules/common/services/navigation'
import { colorPalette as colors } from '@modules/common/styles/colors'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import HardwareWalletConnectScreen from '@modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import BiometricsSignScreen from '@modules/settings/screens/BiometricsSignScreen'
import ChangeAppLockingScreen from '@modules/settings/screens/ChangeAppLockingScreen'
import ChangeLocalAuthScreen from '@modules/settings/screens/ChangeLocalAuthScreen'
import ChangePasscodeScreen from '@modules/settings/screens/ChangePasscodeScreen'
import SignersScreen from '@modules/settings/screens/SignersScreen'
import SignMessage from '@modules/sign-message/screens/SignMessage'
import SwapScreen from '@modules/swap/screens/SwapScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Header from './Header'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const MainStack = createNativeStackNavigator()
const DashboardStack = createNativeStackNavigator()
const SwapStack = createNativeStackNavigator()
const TransactionsStack = createNativeStackNavigator()
const EarnStack = createNativeStackNavigator()
const SendStack = createNativeStackNavigator()

const headerAlpha = (props) => <Header withHamburger withScanner {...props} />
const headerBeta = (props) => <Header withHamburger withScanner mode="title" {...props} />
const headerGamma = (props) => <Header mode="title" {...props} />

// const globalScreenOptions = ({ navigation }: any) => ({
//   headerStyle: {
//     backgroundColor: 'transparent'
//   },
//   headerTintColor: colors.titan,
//   headerTitleStyle: {
//     fontSize: 18,
//     fontFamily: FONT_FAMILIES.REGULAR
//   },
//   headerBackTitleVisible: false,
//   headerTransparent: true,
//   headerShadowVisible: false,
//   headerLeft: ({ canGoBack }: any) =>
//     canGoBack ? (
//       <NavIconWrapper onPress={navigation.goBack}>
//         <LeftArrowIcon />
//       </NavIconWrapper>
//     ) : null
// })

const TAB_BAR_ICON_SIZE = 22

// const hamburgerHeaderLeft = (navigation: any) => () =>
//   (
//     <NavIconWrapper onPress={navigation.openDrawer}>
//       <BurgerIcon />
//     </NavIconWrapper>
//   )

// const tabsScreenOptions = ({ navigation }: any): any => ({
//   ...globalScreenOptions({ navigation }),
//   headerTitleAlign: 'center',
//   headerRight: () => (
//     <TouchableOpacity
//       onPress={() => navigation.navigate('connect')}
//       hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
//     >
//       <ScanIcon />
//     </TouchableOpacity>
//   ),
//   headerLeft: hamburgerHeaderLeft(navigation)
// })

const DashboardStackScreen = () => {
  const { t } = useTranslation()

  return (
    <DashboardStack.Navigator screenOptions={{ header: headerAlpha }}>
      <DashboardStack.Screen
        name="dashboard"
        component={DashboardScreen}
        options={{ title: t('Dashboard') }}
      />
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="addNewAccount"
        options={{ title: t('Create new Account') }}
        component={AddNewAccountScreen}
      />
      <Stack.Screen
        name="emailLogin"
        options={{ title: t('Login') }}
        component={EmailLoginScreen}
      />
      <Stack.Screen
        name="jsonLogin"
        options={{ title: t('Import from JSON') }}
        component={JsonLoginScreen}
      />
      <Stack.Screen
        name="qrCodeLogin"
        options={{ title: t('Import with QR Code') }}
        component={QRCodeLoginScreen}
      />
      <Stack.Screen
        name="hardwareWallet"
        options={{ title: t('Hardware Wallet') }}
        component={HardwareWalletConnectScreen}
      />
    </DashboardStack.Navigator>
  )
}

const SwapStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SwapStack.Navigator screenOptions={{ header: headerAlpha }}>
      <SwapStack.Screen
        name="swap"
        component={SwapScreen}
        options={{
          title: t('Ambire Swap')
        }}
      />
    </SwapStack.Navigator>
  )
}

const TransactionsStackScreen = () => {
  const { t } = useTranslation()

  return (
    <TransactionsStack.Navigator screenOptions={{ header: headerAlpha }}>
      <TransactionsStack.Screen
        name="transactions"
        component={TransactionsScreen}
        options={{
          title: t('Transactions')
        }}
      />
    </TransactionsStack.Navigator>
  )
}

const EarnStackScreen = () => {
  const { t } = useTranslation()

  return (
    <EarnStack.Navigator screenOptions={{ header: headerAlpha }}>
      <EarnStack.Screen
        name="earn"
        component={EarnScreen}
        options={{
          title: t('Earn')
        }}
      />
    </EarnStack.Navigator>
  )
}

const SendStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SendStack.Navigator screenOptions={{ header: headerAlpha }}>
      <SendStack.Screen
        name="send"
        component={SendScreen}
        options={{
          title: t('Send')
        }}
      />
    </SendStack.Navigator>
  )
}

const AuthStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: headerGamma }}>
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="addNewAccount"
        options={{ title: t('Create new Account') }}
        component={AddNewAccountScreen}
      />
      <Stack.Screen
        name="emailLogin"
        options={{ title: t('Login') }}
        component={EmailLoginScreen}
      />
      <Stack.Screen
        name="jsonLogin"
        options={{ title: t('Import from JSON') }}
        component={JsonLoginScreen}
      />
      <Stack.Screen
        name="qrCodeLogin"
        options={{ title: t('Import with QR Code') }}
        component={QRCodeLoginScreen}
      />
      <Stack.Screen
        name="hardwareWallet"
        options={{ title: t('Hardware Wallet') }}
        component={HardwareWalletConnectScreen}
      />
    </Stack.Navigator>
  )
}

const NoConnectionStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: headerGamma }}>
      <Stack.Screen
        options={{ title: t('No connection') }}
        name="no-connection"
        component={NoConnectionScreen}
      />
    </Stack.Navigator>
  )
}

const AppTabs = () => {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.heliotrope,
        tabBarInactiveTintColor: colors.titan,
        tabBarInactiveBackgroundColor: colors.valhalla,
        tabBarActiveBackgroundColor: colors.valhalla,
        tabBarStyle: {
          backgroundColor: colors.valhalla,
          borderTopColor: colors.baileyBells
        },
        tabBarLabelStyle: {
          paddingBottom: 5
        }
      }}
    >
      <Tab.Screen
        name="dashboard-tab"
        options={{
          headerShown: false,
          tabBarLabel: t('Dashboard'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={DashboardStackScreen}
      />
      <Tab.Screen
        name="earn-tab"
        options={{
          headerShown: false,
          tabBarLabel: t('Earn'),
          tabBarIcon: ({ color }) => (
            // Use this one, because the actual one is <BsPiggyBank />,
            // but the Bootstrap Icons set is not available
            <MaterialIcons name="attach-money" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={EarnStackScreen}
      />
      <Tab.Screen
        name="send-tab"
        options={{
          headerShown: false,
          tabBarLabel: t('Send'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare-arrows" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={SendStackScreen}
      />
      <Tab.Screen
        name="swap-tab"
        options={{
          headerShown: false,
          tabBarLabel: t('Swap'),
          // Use this one, because the actual one is <BiTransfer />,
          // but the Box Icons set is not available
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="retweet" size={TAB_BAR_ICON_SIZE - 4} color={color} />
          )
        }}
        component={SwapStackScreen}
      />
      <Tab.Screen
        name="transactions-tab"
        options={{
          headerShown: false,
          tabBarLabel: t('Transactions'),
          // Use this one, because the actual one is <BiTransfer />,
          // but the Box Icons set is not available
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="send-and-archive" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={TransactionsStackScreen}
      />
    </Tab.Navigator>
  )
}

const AppDrawer = () => {
  const { t } = useTranslation()

  return (
    <Drawer.Navigator
      drawerContent={DrawerContent}
      screenOptions={({ navigation }: any): DrawerNavigationOptions => ({
        // ...globalScreenOptions({ navigation }),
        // headerTitleAlign: 'center',
        // headerLeft: hamburgerHeaderLeft(navigation),
        // headerShown: false,
        header: headerBeta,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: colors.clay,
          borderTopRightRadius: 13,
          borderBottomRightRadius: 13,
          width: 282
        }
      })}
    >
      <Drawer.Screen
        name="tabs"
        component={AppTabs}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="passcode-change"
        component={ChangePasscodeScreen}
        options={{
          title: t('Passcode')
        }}
      />
      <Drawer.Screen
        name="local-auth-change"
        component={ChangeLocalAuthScreen}
        options={{
          title: t('Local auth')
        }}
      />
      <Drawer.Screen
        name="biometrics-sign-change"
        component={BiometricsSignScreen}
        options={{
          title: t('Sign with Biometrics')
        }}
      />
      <Drawer.Screen
        name="app-locking"
        component={ChangeAppLockingScreen}
        options={{
          title: t('App Locking')
        }}
      />
      <Drawer.Screen
        name="signers"
        component={SignersScreen}
        options={{
          title: t('Manage signers')
        }}
      />
    </Drawer.Navigator>
  )
}

const AppStack = () => {
  const { t } = useTranslation()
  const { isLoading } = usePasscode()

  useEffect(() => {
    if (isLoading) return

    SplashScreen.hideAsync()
  }, [isLoading])

  return (
    <MainStack.Navigator
      screenOptions={(navigation) => ({
        header: headerGamma
        // headerTitleAlign: 'center',
        // ...globalScreenOptions(navigation)
      })}
    >
      <MainStack.Screen
        name="drawer"
        component={AppDrawer}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen
        name="connect"
        component={ConnectScreen}
        options={{ title: t('Connect a dApp') }}
      />
      <MainStack.Screen
        name="receive"
        options={{ title: t('Receive') }}
        component={ReceiveScreen}
      />
      <MainStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{ title: t('Pending Transaction') }}
      />
      <MainStack.Screen
        name="sign-message"
        component={SignMessage}
        options={{ title: t('Sign') }}
      />
    </MainStack.Navigator>
  )
}

const Router = () => {
  const { authStatus } = useAuth()
  const { connectionState } = useNetInfo()

  const renderContent = useCallback(() => {
    if (connectionState === ConnectionStates.NOT_CONNECTED) {
      return <NoConnectionStack />
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return <AuthStack />
    }

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      return <AppStack />
    }

    // authStatus === AUTH_STATUS.LOADING or anything else:
    return null
  }, [connectionState, authStatus])

  const handleOnReady = () => {
    // @ts-ignore for some reason TS complains about this 👇
    routeNameRef.current = navigationRef.current.getCurrentRoute()?.name
  }

  return (
    <NavigationContainer
      // Part of the mechanism for being able to navigate without the navigation prop.
      // For more details, see the NavigationService.
      ref={navigationRef}
      onReady={handleOnReady}
      theme={{
        dark: true,
        colors: {
          primary: colors.clay,
          background: 'transparent',
          card: colors.clay,
          text: colors.titan,
          border: 'transparent',
          notification: colors.clay
        }
      }}
    >
      {renderContent()}
    </NavigationContainer>
  )
}

export default Router
