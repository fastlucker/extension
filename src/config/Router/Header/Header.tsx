import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BurgerIcon from '@assets/svg/BurgerIcon'
import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import { colorPalette as colors } from '@modules/common/styles/colors'
import { DEVICE_WIDTH } from '@modules/common/styles/spacings'
import { getHeaderTitle, Header as RNHeader } from '@react-navigation/elements'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'

interface Props extends NativeStackHeaderProps {
  mode?: 'title' | 'switcher'
  withHamburger?: boolean
  withScanner?: boolean
}

const Header: React.FC<Props> = ({
  mode = 'switcher',
  withHamburger = false,
  withScanner = false,
  navigation,
  route,
  options
}) => {
  const canGoBack = navigation.canGoBack()
  const title = getHeaderTitle(options, route.name)

  const headerTitle = () => <View style={{ backgroundColor: 'red', width: 200, height: 50 }} />

  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        top: 0,
        zIndex: 998,
        elevation: 10,
        width: DEVICE_WIDTH
      }}
    >
      <RNHeader
        title={title}
        headerTitle={mode === 'switcher' ? headerTitle : undefined}
        headerRightContainerStyle={{
          paddingRight: 20
        }}
        headerLeftContainerStyle={{
          paddingLeft: 20
        }}
        headerLeftLabelVisible={!!canGoBack}
        headerStyle={{
          // TODO:
          backgroundColor: 'transparent'
          // height: 100
        }}
        headerLeft={() => {
          if (withHamburger) {
            return (
              <NavIconWrapper onPress={navigation.openDrawer}>
                <BurgerIcon />
              </NavIconWrapper>
            )
          }

          if (canGoBack) {
            return (
              <NavIconWrapper onPress={navigation.goBack}>
                <LeftArrowIcon />
              </NavIconWrapper>
            )
          }
          return null
        }}
        headerTitleStyle={{
          fontSize: 18,
          fontFamily: FONT_FAMILIES.REGULAR
        }}
        headerTintColor={colors.titan}
        // headerBackTitleVisible={false}
        // headerTransparent={true}
        headerShadowVisible={false}
        headerTitleAlign="center"
        headerRight={() =>
          withScanner ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('connect')}
              hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            >
              <ScanIcon />
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

export default Header
