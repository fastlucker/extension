import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BurgerIcon from '@common/assets/svg/BurgerIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { isiOS } from '@common/config/env'
import { DrawerHeaderProps } from '@react-navigation/drawer'
import { getHeaderTitle } from '@react-navigation/elements'

import styles from './styles'

interface Props extends DrawerHeaderProps {
  mode?: 'title' | 'bottom-sheet'
  withHamburger?: boolean
  withHeaderRight?: boolean
}

const Header: React.FC<Props> = ({
  mode = 'bottom-sheet',
  withHamburger = false,
  withHeaderRight = false,
  navigation,
  route,
  options
}) => {
  const insets = useSafeAreaInsets()
  const canGoBack = navigation.canGoBack()
  const title = getHeaderTitle(options, route.name)

  const renderHeaderLeft = () => {
    if (typeof options.headerLeft === 'function') {
      return options.headerLeft({})
    }

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
          <LeftArrowIcon withRect={mode !== 'bottom-sheet'} />
        </NavIconWrapper>
      )
    }
    return null
  }

  const renderHeaderRight = null

  // On the left and on the right side, there is always reserved space
  // for the nav bar buttons. And so that in case a title is present,
  // it is centered always in the logical horizontal middle.
  const navIconContainer =
    mode === 'bottom-sheet' ? styles.navIconContainerSmall : styles.navIconContainerRegular

  // The header should start a little bit below the end of the notch
  const notchInset = insets.top + 5

  // Using the `<Header />` from the '@react-navigation/elements' created
  // many complications in terms of styling the UI, calculating the header
  // height and the spacings between the `headerLeftContainerStyle` and the
  // `headerRightContainerStyle`. The calculations never match.
  // Probably due to the fact the box model of the `<Header />` behaves
  // in different manner. And styling it was hell. So instead - implement
  // custom components that fully match the design we follow.
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: notchInset
        }
      ]}
    >
      <View style={navIconContainer}>{renderHeaderLeft()}</View>

      {mode === 'title' && (
        <Text fontSize={18} weight="regular" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      {mode === 'title' && <View style={navIconContainer}>{renderHeaderRight}</View>}
      {isiOS && mode === 'title' && <View style={navIconContainer} />}
    </View>
  )
}

export default React.memo(Header)
