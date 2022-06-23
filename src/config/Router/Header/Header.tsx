import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BurgerIcon from '@assets/svg/BurgerIcon'
import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import ScanIcon from '@assets/svg/ScanIcon'
import Blockies from '@modules/common/components/Blockies'
import CopyText from '@modules/common/components/CopyText'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import useHeaderBottomSheet from '@modules/common/hooks/useHeaderBottomSheet'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePrivateMode from '@modules/common/hooks/usePrivateMode'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { DrawerHeaderProps } from '@react-navigation/drawer'
import { getHeaderTitle } from '@react-navigation/elements'

import styles from './style'

interface Props extends DrawerHeaderProps {
  mode?: 'title' | 'bottom-sheet'
  withHamburger?: boolean
  withScanner?: boolean
}

const Header: React.FC<Props> = ({
  mode = 'bottom-sheet',
  withHamburger = false,
  withScanner = false,
  navigation,
  route,
  options
}) => {
  const insets = useSafeAreaInsets()
  const canGoBack = navigation.canGoBack()
  const title = getHeaderTitle(options, route.name)
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { openHeaderBottomSheet } = useHeaderBottomSheet()
  const { hidePrivateValue } = usePrivateMode()
  const renderBottomSheetSwitcher = (
    <TouchableOpacity style={styles.switcherContainer} onPress={openHeaderBottomSheet}>
      <Blockies borderRadius={13} seed={selectedAcc} />

      <View style={[flexboxStyles.flex1, spacings.mhTy]}>
        <Text weight="regular">{network?.name}</Text>
        <Text color={colors.baileyBells} fontSize={12} numberOfLines={1} ellipsizeMode="middle">
          {hidePrivateValue(selectedAcc)}
        </Text>
      </View>

      <CopyText text={selectedAcc} />
    </TouchableOpacity>
  )

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

  const renderHeaderRight = withScanner ? (
    <NavIconWrapper onPress={() => navigation.navigate('connect')}>
      <ScanIcon />
    </NavIconWrapper>
  ) : null

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
    <View style={[styles.container, { paddingTop: notchInset }]}>
      <View style={navIconContainer}>{renderHeaderLeft()}</View>

      {mode === 'bottom-sheet' && renderBottomSheetSwitcher}
      {mode === 'title' && (
        <Text fontSize={18} weight="regular" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={navIconContainer}>{renderHeaderRight}</View>
    </View>
  )
}

export default React.memo(Header)
