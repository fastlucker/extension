import { FC } from 'react'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

interface Props {
  children: React.ReactNode | React.ReactNode[]
  horizontalAlignment?: 'justifySpaceBetween' | 'justifyCenter' | 'justifyEnd' | 'justifyStart'
}

const DialogFooter: FC<Props> = ({ children, horizontalAlignment = 'justifyEnd' }) => (
  <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox[horizontalAlignment]]}>
    {children}
  </View>
)

export default DialogFooter
