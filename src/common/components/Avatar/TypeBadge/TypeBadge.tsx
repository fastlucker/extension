import React, { FC } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { SPACING_MI } from '@common/styles/spacings'

interface Props {
  isSmart: boolean
  type?: string
}

const TypeBadge: FC<Props> = ({ isSmart, type }) => {
  const { theme } = useTheme()

  return (
    <View
      style={{
        position: 'absolute',
        left: type === 'big' ? -SPACING_MI / 2 : -SPACING_MI,
        top: type === 'big' ? -SPACING_MI / 2 : -SPACING_MI,
        paddingHorizontal: 3,
        paddingVertical: 2,
        backgroundColor: isSmart ? theme.successDecorative : theme.warningDecorative,
        zIndex: 2,
        borderRadius: 50,
        borderWidth: type === 'big' ? 3 : 2,
        borderColor: '#fff'
      }}
    >
      <Text color="#fff" weight="semiBold" fontSize={type === 'big' ? 10 : 9}>
        {isSmart ? 'SA' : 'BA'}
      </Text>
    </View>
  )
}

export default TypeBadge
