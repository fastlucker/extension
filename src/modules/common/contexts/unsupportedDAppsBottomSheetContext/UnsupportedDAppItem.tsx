import React, { useState } from 'react'
import { Image, Linking, TouchableOpacity, View } from 'react-native'

import MissingIcon from '@assets/svg/MissingIcon'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  name: string
  icon: string
  url: string
}

const UnsupportedDAppItem = ({ name, icon, url }: Props) => {
  const [showFallbackImg, setShowFallbackImg] = useState(false)

  const renderIcon =
    !!showFallbackImg || !icon ? (
      <View style={spacings.mrTy}>
        <MissingIcon withRect />
      </View>
    ) : (
      <Image
        source={{ uri: icon }}
        onError={() => setShowFallbackImg(true)}
        style={styles.itemIcon}
      />
    )

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={[flexboxStyles.directionRow, spacings.pvTy, spacings.phTy, flexboxStyles.alignCenter]}
    >
      {renderIcon}
      <Text style={flexboxStyles.flex1} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(UnsupportedDAppItem)
