import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import AccountChanger from '@config/Router/Header/AccountChanger'
import NetworkChanger from '@config/Router/Header/NetworkChanger'
import Blockies from '@modules/common/components/Blockies'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import CopyText from '@modules/common/components/CopyText'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const Switcher: React.FC = () => {
  const { sheetRef, isOpen, closeBottomSheet, openBottomSheet } = useBottomSheet()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()

  return (
    <>
      <TouchableOpacity style={styles.switcherContainer} onPress={openBottomSheet}>
        <Blockies borderRadius={13} seed={selectedAcc} />

        <View style={[flexboxStyles.flex1, spacings.mhTy]}>
          <Text weight="regular">{network?.name}</Text>
          <Text color={colors.baileyBells} fontSize={12} numberOfLines={1} ellipsizeMode="middle">
            {selectedAcc}
          </Text>
        </View>

        <CopyText text={selectedAcc} />
      </TouchableOpacity>
      <BottomSheet
        id="header-switcher"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
        displayCancel={false}
      >
        <NetworkChanger closeBottomSheet={closeBottomSheet} />
        <View style={[styles.separator, spacings.mb]} />
        <AccountChanger closeBottomSheet={closeBottomSheet} />
      </BottomSheet>
    </>
  )
}

export default Switcher
