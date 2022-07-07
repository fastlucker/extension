import React, { ReactNode } from 'react'
import { View } from 'react-native'
import RNModal from 'react-native-modal'

import { Portal } from '@gorhom/portal'

import Backdrop from './Backdrop'
import styles from './styles'

interface Props {
  isVisible: boolean
  hideModal: () => void
  children: ReactNode
}

const Modal = ({ isVisible, hideModal, children }: Props) => {
  return (
    <Portal hostName="global">
      <RNModal
        isVisible={isVisible}
        backdropOpacity={1}
        backdropTransitionOutTiming={0}
        customBackdrop={
          <Backdrop
            onPress={() => {
              hideModal()
            }}
          />
        }
      >
        <View style={styles.container}>{children}</View>
      </RNModal>
    </Portal>
  )
}

export default React.memo(Modal)
