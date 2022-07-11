import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import NetworkIcon from '@modules/common/components/NetworkIcon'
import { NetworkIconNameType } from '@modules/common/components/NetworkIcon/NetworkIcon'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

type Props = {
  idx: number
  name: string
  iconName: NetworkIconNameType
  isActive: boolean
  onPress: (idx: number) => void
}

const NetworkChangerItem = ({ idx, name, iconName, isActive, onPress }: Props) => {
  const handlePress = () => {
    !!onPress && onPress(idx)
  }

  return (
    <TouchableOpacity
      style={[styles.networkBtnContainer]}
      onPress={handlePress}
      disabled={isActive}
      activeOpacity={0.6}
    >
      <Text
        weight="regular"
        color={isActive ? colors.titan : colors.titan_50}
        style={[flexboxStyles.flex1, textStyles.center]}
        numberOfLines={1}
      >
        {name}
      </Text>
      <View style={styles.networkBtnIcon}>
        <NetworkIcon name={iconName} />
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(NetworkChangerItem)
