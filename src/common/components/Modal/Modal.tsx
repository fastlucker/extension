import React, { ReactElement } from 'react'
import { Modal as RNModal, TouchableOpacity, View, ViewStyle } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string
  modalStyle?: ViewStyle | ViewStyle[]
  children: ReactElement | ReactElement[]
}

const Modal = ({ isOpen, onClose, title, modalStyle, children }: Props) => {
  const { styles } = useTheme(getStyles)

  return (
    <RNModal animationType="fade" transparent visible={isOpen} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={[styles.modal, modalStyle]}>
          {!!onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <CloseIcon />
            </TouchableOpacity>
          )}
          {!!title && (
            <Text fontSize={20} weight="medium" style={spacings.mbLg}>
              {title}
            </Text>
          )}
          {children}
        </View>
      </View>
    </RNModal>
  )
}

export default Modal
