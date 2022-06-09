import React from 'react'
import { View } from 'react-native'

import AccountChanger from '@config/Router/Header/AccountChanger'
import NetworkChanger from '@config/Router/Header/NetworkChanger'
import BottomSheet from '@modules/common/components/BottomSheet'
import { UseBottomSheetReturnType } from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

interface Props {
  sheetRef: UseBottomSheetReturnType['sheetRef']
  isOpen: UseBottomSheetReturnType['isOpen']
  closeBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
}

const HeaderBottomSheet: React.FC<Props> = ({ sheetRef, isOpen, closeBottomSheet }: Props) => {
  return (
    <BottomSheet
      id="header-switcher"
      sheetRef={sheetRef}
      isOpen={isOpen}
      closeBottomSheet={closeBottomSheet}
      displayCancel={false}
    >
      <NetworkChanger />
      <View style={[styles.separator, spacings.mb]} />
      <AccountChanger closeBottomSheet={closeBottomSheet} />
    </BottomSheet>
  )
}

export default React.memo(HeaderBottomSheet)
