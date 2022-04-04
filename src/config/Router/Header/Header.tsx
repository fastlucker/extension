import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BurgerIcon from '@assets/svg/BurgerIcon'
import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import { getHeaderTitle } from '@react-navigation/elements'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'

import styles from './style'

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

  const renderHeaderSwitcher = () => (
    <View style={styles.switcherContainer}>
      <Text weight="regular">{network?.name}</Text>
      <Text fontSize={12} numberOfLines={1} ellipsizeMode="middle">
        {selectedAcc}
      </Text>
    </View>
  )

  const renderHeaderLeft = () => {
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
  }

  const renderHeaderRight = () =>
    withScanner ? (
      <NavIconWrapper onPress={() => navigation.navigate('connect')}>
        <ScanIcon />
      </NavIconWrapper>
    ) : null

  // Using the `<Header />` from the '@react-navigation/elements' created
  // many complications in terms of styling the UI, calculating the header
  // height and the spacings between the `headerLeftContainerStyle` and the
  // `headerRightContainerStyle`. The calculations never match.
  // Probably due to the fact the box model of the `<Header />` behaves
  // in different manner. And styling it was hell. So instead - implement
  // custom components that fully match the design we follow.
  return (
    <View style={[styles.container, { paddingTop: insets.top + 5 }]}>
      <View style={styles.navIconContainer}>{renderHeaderLeft()}</View>

      {mode === 'switcher' && renderHeaderSwitcher()}
      {mode === 'title' && (
        <Text fontSize={18} weight="regular" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={styles.navIconContainer}>{renderHeaderRight()}</View>
    </View>
  )
}

export default Header
