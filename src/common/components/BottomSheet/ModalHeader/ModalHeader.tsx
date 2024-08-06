import React, { FC } from 'react'
import { TouchableOpacity, View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import BackButton from '@common/components/BackButton'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

interface Props {
  hideLeftSideContainer?: boolean
  handleClose?: () => void
  withBackButton?: boolean
  title?: string
  titleSuffix?: JSX.Element
}

const ModalHeader: FC<Props> = ({
  hideLeftSideContainer = false,
  handleClose,
  withBackButton = true,
  title,
  titleSuffix
}) => {
  const styles = getStyles()

  return (
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
  )
}

export default React.memo(ModalHeader)
