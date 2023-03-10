import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, TouchableOpacity, View } from 'react-native'

import DisconnectIcon from '@common/assets/svg/DisconnectIcon'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import Text from '@common/components/Text'
import { AmbireExtensionContextReturnType } from '@common/contexts/ambireExtensionContext/types'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import ManifestImage from '@web/components/ManifestImage'
import { ConnectedSite } from '@web/extension-services/background/services/permission'

import styles from './styles'

type Props = {
  name: ConnectedSite['name']
  origin: ConnectedSite['origin']
  icon: ConnectedSite['icon']
  isConnected: ConnectedSite['isConnected']
  disconnectDapp: AmbireExtensionContextReturnType['disconnectDapp']
  isLast: boolean
}

const ConnectedDAppItem = ({ name, origin, icon, isConnected, disconnectDapp, isLast }: Props) => {
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(origin)}
      style={[styles.itemContainer, isLast && spacings.mb]}
    >
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <ManifestImage
            uri={icon}
            size={34}
            fallback={() => <ManifestFallbackIcon width={34} height={34} />}
          />
          <View style={[flexboxStyles.flex1, spacings.plTy]}>
            <Text numberOfLines={1} style={[flexboxStyles.flex1, spacings.mrMi]}>
              {name}
            </Text>
            <Text fontSize={10} color={isConnected ? colors.turquoise : colors.pink}>
              {isConnected ? t('Connected') : t('Blocked')} ({new URL(origin).hostname})
            </Text>
          </View>
        </View>
        {isConnected && (
          <TouchableOpacity onPress={() => disconnectDapp(origin)}>
            <DisconnectIcon />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(ConnectedDAppItem)
