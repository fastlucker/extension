import React, { ReactNode } from 'react'
import { Modal as RNModal, Pressable, TouchableOpacity, View, ViewStyle } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import BackButton from '../BackButton'
import getStyles from './styles'

type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string
  titleSuffix?: JSX.Element
  hideLeftSideContainer?: boolean
  modalStyle?: ViewStyle | ViewStyle[]
  children: ReactNode | ReactNode[]
  customHeader?: ReactNode
  withBackButton?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  title,
  titleSuffix,
  modalStyle,
  children,
  withBackButton,
  customHeader,
  hideLeftSideContainer = false
}: Props) => {
  const { styles } = useTheme(getStyles)

  return (
    <RNModal animationType="fade" transparent visible={isOpen} onRequestClose={onClose}>
      <Pressable
        onPress={() => !!onClose && onClose()}
        // @ts-ignore
        style={[styles.container, !onClose && isWeb ? { cursor: 'default' } : {}]}
      >
        <Pressable style={[styles.modal, modalStyle]}>
          {!customHeader ? (
            <View style={styles.modalHeader}>
              {!hideLeftSideContainer && (
                <View style={styles.sideContainer}>
                  {!!onClose && withBackButton && (
                    <View style={styles.backButton}>
                      <BackButton onPress={onClose} />
                    </View>
                  )}
                </View>
              )}
              {!!title && (
                <Text fontSize={20} weight="medium" style={!!titleSuffix && spacings.mrSm}>
                  {title}
                </Text>
              )}
              {titleSuffix}
              <View style={styles.sideContainer}>
                {!!onClose && !withBackButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                    <CloseIcon />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            customHeader
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

export default Modal
