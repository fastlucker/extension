import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'

const Header: React.FC<NativeStackHeaderProps> = ({ navigation }) => {
  // TODO:
  // const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={{ height: 150, flexDirection: 'row' }}>
      <NavIconWrapper onPress={navigation.goBack}>
        <LeftArrowIcon />
      </NavIconWrapper>

      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text>Address</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('connect')}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      >
        <ScanIcon />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Header
