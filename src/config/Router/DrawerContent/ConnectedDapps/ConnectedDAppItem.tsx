import React, { useState } from 'react'
import { Image, Linking, TouchableOpacity, View } from 'react-native'

import MissingIcon from '@assets/svg/MissingIcon'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  name: string
  icon: string
  url: string
  isLegacy?: boolean
  isOffline?: boolean
  disconnect: (uri: string) => void
  uri: string
}

const ConnectedDAppItem = ({ name, icon, url, isLegacy, isOffline, disconnect, uri }: Props) => {
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
      <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        {renderIcon}
        <Text numberOfLines={1} style={[flexboxStyles.flex1, spacings.mrMi]}>
          {name}
        </Text>
      </View>
      <Button
        size="small"
        type="secondary"
        hitSlop={{ bottom: 10, top: 10, left: 5, right: 5 }}
        text="Disconnect"
        textStyle={{ fontSize: 11 }}
        hasBottomSpacing={false}
        onPress={() => disconnect(uri)}
      />
    </TouchableOpacity>
  )
}

export default ConnectedDAppItem
