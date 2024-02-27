import React, { ReactNode } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import BackButton from '../BackButton'
import BottomSheet from '../BottomSheet'
import getStyles from './styles'

type Props = {
  modalRef: any
  handleClose: () => void
  title?: string
  titleSuffix?: JSX.Element
  hideLeftSideContainer?: boolean
  modalStyle?: ViewStyle | ViewStyle[]
  modalInnerStyle?: ViewStyle | ViewStyle[]
  children: ReactNode | ReactNode[]
  customHeader?: ReactNode
  withBackButton?: boolean
}

const Modal = ({
  modalRef,
  handleClose,
  title,
  titleSuffix,
  modalStyle = {},
  modalInnerStyle = {},
  children,
  withBackButton,
  customHeader,
  hideLeftSideContainer = false
}: Props) => {
  const { styles, theme } = useTheme(getStyles)

  return (
    <BottomSheet
      id="add-token"
      sheetRef={modalRef}
      closeBottomSheet={handleClose}
      style={{
        backgroundColor: theme.primaryBackground,
        ...styles.modal,
        ...modalStyle
      }}
      forceModal
    >
      <View style={[styles.modalInner, modalInnerStyle]}>
        {!customHeader ? (
          <View style={styles.modalHeader}>
            {!hideLeftSideContainer && (
              <View style={styles.sideContainer}>
                {!!handleClose && withBackButton && (
                  <View style={styles.backButton}>
                    <BackButton onPress={handleClose} />
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
              {!!handleClose && !withBackButton && (
                <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
                  <CloseIcon />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          customHeader
        )}
        {children}
      </View>
    </BottomSheet>
  )
}

export default Modal
