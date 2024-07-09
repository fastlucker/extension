import React, { FC } from 'react'

import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

interface Props {
  id: string
  dialogRef: any
  title: string
  text: string
  closeDialog: () => void
  children: React.ReactNode | React.ReactNode[]
}

const Dialog: FC<Props> = ({ id, dialogRef, closeDialog, title, text, children }) => {
  return (
    <BottomSheet
      id={id}
      sheetRef={dialogRef}
      closeBottomSheet={closeDialog}
      type="modal"
      style={{
        overflow: 'hidden',
        width: 512
      }}
      backgroundColor="primaryBackground"
    >
      <Text fontSize={18} weight="semiBold" style={spacings.mbMi}>
        {title}
      </Text>
      <Text fontSize={14} style={spacings.mb}>
        {text}
      </Text>
      {children}
    </BottomSheet>
  )
}

export default Dialog
