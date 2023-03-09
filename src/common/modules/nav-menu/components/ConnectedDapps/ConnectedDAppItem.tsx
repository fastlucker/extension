import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, TouchableOpacity, View } from 'react-native'

import DisconnectIcon from '@common/assets/svg/DisconnectIcon'
import MissingIcon from '@common/assets/svg/MissingIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  name: string
  icon: string
  url: string
  isLegacy?: boolean
  isOffline?: boolean
  disconnect: (uri: string) => void
  uri: string
  isLast: boolean
}

const ConnectedDAppItem = ({
  name,
  icon,
  url,
  isLegacy,
  isOffline,
  disconnect,
  uri,
  isLast
}: Props) => {
  const { t } = useTranslation()

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
      style={[styles.itemContainer, isLast && spacings.mb]}
    >
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          {renderIcon}
          <Text numberOfLines={1} style={[flexboxStyles.flex1, spacings.mrMi]}>
            {name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => disconnect(uri)}>
          <DisconnectIcon />
        </TouchableOpacity>
      </View>
      <View style={[spacings.phTy, (isLegacy || isOffline) && spacings.ptTy]}>
        {!!isLegacy && (
          <Text fontSize={10} style={isOffline && spacings.mbTy} color={colors.mustard}>
            {t(
              "dApp uses legacy WalletConnect bridge which is unreliable and often doesn't work. Please tell the dApp to update to the latest WalletConnect version."
            )}
          </Text>
        )}
        {!!isOffline && (
          <Text fontSize={10} color={colors.pink}>
            {t(
              'WalletConnect connection may be offline. Check again later. If this warning persist try to disconnect and connect WalletConnect.'
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(ConnectedDAppItem)
