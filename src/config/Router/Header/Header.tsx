import React from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BurgerIcon from '@assets/svg/BurgerIcon'
import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import { getHeaderTitle, Header as RNHeader } from '@react-navigation/elements'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'

const Header: React.FC<NativeStackHeaderProps> = ({ navigation, route, options }) => {
  // TODO:
  const canGoBack = navigation.canGoBack()
  const title = getHeaderTitle(options, route.name)

  return (
    <SafeAreaView style={{ backgroundColor: 'yellow' }}>
      <RNHeader
        title={title}
        headerRightContainerStyle={{
          paddingRight: 20
        }}
        headerLeftContainerStyle={{
          paddingLeft: 20
        }}
        headerLeftLabelVisible={!!canGoBack}
        headerStyle={{
          // TODO:
          backgroundColor: 'red'
          // height: 30
        }}
        headerTitle={() => <Text>Hi</Text>}
        headerLeft={() => {
          if (canGoBack) {
            return (
              <NavIconWrapper onPress={navigation.goBack}>
                <LeftArrowIcon />
              </NavIconWrapper>
            )
          }
          return (
            <NavIconWrapper onPress={navigation.openDrawer}>
              <BurgerIcon />
            </NavIconWrapper>
          )
        }}
        headerTitleStyle={{
          fontSize: 20
        }}
        headerRight={() => (
          <TouchableOpacity
            onPress={() => navigation.navigate('connect')}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          >
            <ScanIcon />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

export default Header
