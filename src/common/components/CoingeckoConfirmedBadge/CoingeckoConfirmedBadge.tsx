import React from 'react'
import { View } from 'react-native'

import CoingeckoIcon from '@common/assets/svg/CoingeckoIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

type Props = {
  text: string
  containerStyle?: any
}

const CoingeckoConfirmedBadge = ({ text, containerStyle }: Props) => {
  const { styles } = useTheme(getStyles)

  return (
    <View style={[styles.container, containerStyle]}>
      <Text weight="medium" fontSize={10} color="#8DC63F" style={spacings.mrMi}>
        {text}
      </Text>
      <SuccessIcon color="#8DC63F" width={20} height={20} withCirc={false} />
      <CoingeckoIcon />
    </View>
  )
}

export default React.memo(CoingeckoConfirmedBadge)
