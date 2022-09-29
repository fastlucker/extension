import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import Blockies from '@modules/common/components/Blockies'
import CopyText from '@modules/common/components/CopyText'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import NetworkIcon from '@modules/common/components/NetworkIcon'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import useHeaderBottomSheet from '@modules/common/hooks/useHeaderBottomSheet'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePrivateMode from '@modules/common/hooks/usePrivateMode'
import colors from '@modules/common/styles/colors'
import spacings, { SPACING_SM } from '@modules/common/styles/spacings'
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
  const canGoBack = navigation.canGoBack()
  const title = getHeaderTitle(options, route.name)
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { openHeaderBottomSheet } = useHeaderBottomSheet()
  const { hidePrivateValue } = usePrivateMode()
  const renderBottomSheetSwitcher = (
    <TouchableOpacity
      style={[flexboxStyles.flex1, flexboxStyles.alignCenter]}
      onPress={openHeaderBottomSheet}
    >
      <Text weight="regular" fontSize={16}>
        {network?.name}
      </Text>
      <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, spacings.phLg]}>
        <Text
          color={colors.baileyBells}
          fontSize={12}
          numberOfLines={1}
          ellipsizeMode="middle"
          style={spacings.prTy}
        >
          {hidePrivateValue(selectedAcc)}
        </Text>
        <CopyText text={selectedAcc} />
      </View>
    </TouchableOpacity>
  )

  const renderHeaderLeft = () => {
    if (typeof options.headerLeft === 'function') {
      return options.headerLeft({})
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

  const renderHeaderRight = (
    <NavIconWrapper onPress={navigation.openDrawer}>
      <Blockies borderRadius={13} size={10} seed={selectedAcc} />
    </NavIconWrapper>
  )

  // On the left and on the right side, there is always reserved space
  // for the nav bar buttons. And so that in case a title is present,
  // it is centered always in the logical horizontal middle.
  const navIconContainer =
    mode === 'bottom-sheet' ? styles.navIconContainerSmall : styles.navIconContainerRegular

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
          paddingTop: SPACING_SM,
          backgroundColor: colors.martinique
        }
      ]}
    >
      <View style={navIconContainer}>
        {!withHamburger && renderHeaderLeft()}
        {!!withHamburger && (
          <NavIconWrapper onPress={openHeaderBottomSheet}>
            <NetworkIcon name={network?.id} style={styles.networkIcon} />
          </NavIconWrapper>
        )}
      </View>
      {mode === 'bottom-sheet' && renderBottomSheetSwitcher}
      {mode === 'title' && (
        <Text fontSize={18} weight="regular" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}
      <View style={navIconContainer}>
        {(!!withHamburger || !!withScanner) && renderHeaderRight}
      </View>
    </View>
  )
}

export default React.memo(Header)
