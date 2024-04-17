import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  id: string
  dialogRef: any
  handleClose: () => void
  handleConfirm: () => void
  title: string
  text: string
  closeButtonText?: string
  confirmButtonText?: string
}

const Dialog: FC<Props> = ({
  id,
  dialogRef,
  handleClose,
  handleConfirm,
  title,
  text,
  closeButtonText,
  confirmButtonText
}) => {
  const { t } = useTranslation()

  return (
    <BottomSheet
      id={id}
      sheetRef={dialogRef}
      closeBottomSheet={handleClose}
      type="modal"
      style={{
        overflow: 'hidden',
        width: 640
      }}
      backgroundColor="primaryBackground"
    >
      <Text fontSize={20} weight="medium" style={spacings.mbSm}>
        {title}
      </Text>
      <Text fontSize={16} style={spacings.mbXl}>
        {text}
      </Text>
      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
        <Button
          hasBottomSpacing={false}
          type="secondary"
          text={closeButtonText || t('Close')}
          onPress={handleClose}
          style={{
            minWidth: 164
          }}
        />
        <Button
          style={{
            minWidth: 240
          }}
          hasBottomSpacing={false}
          text={confirmButtonText || t('Confirm')}
          onPress={handleConfirm}
        />
      </View>
    </BottomSheet>
  )
}

export default Dialog
