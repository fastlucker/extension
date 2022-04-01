import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BurgerIcon from '@assets/svg/BurgerIcon'
import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import useNetwork from '@modules/common/hooks/useNetwork'
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
  const insets = useSafeAreaInsets()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const canGoBack = navigation.canGoBack()
  const title = getHeaderTitle(options, route.name)

  const headerTitle = () => (
    <View
      style={{
        backgroundColor: colors.valhalla,
        height: 50,
        borderRadius: 13,
        justifyContent: 'center',
        paddingHorizontal: 10,
        width: DEVICE_WIDTH - 110 // that's minus the left and right actions
      }}
    >
      <Text weight="regular">{network?.name}</Text>
      <Text fontSize={12} numberOfLines={1} ellipsizeMode="middle">
        {selectedAcc}
      </Text>
    </View>
  )

  return (
    <View style={{ paddingTop: insets.top + 5, paddingBottom: 15 }}>
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
          backgroundColor: colors.wooed,
          height: 50 // kind of a magic number
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
    </View>
  )
}

export default Header
