import { FC } from 'react'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

const DialogFooter: FC<Props> = ({ children }) => (
  <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
    {children}
  </View>
)

export default DialogFooter
