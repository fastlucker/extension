import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, TouchableOpacity, View } from 'react-native'

import DisconnectIcon from '@assets/svg/DisconnectIcon'
import ManifestFallbackIcon from '@assets/svg/ManifestFallbackIcon'
import Text from '@modules/common/components/Text'
import { AmbireExtensionContextReturnType } from '@modules/common/contexts/ambireExtensionContext/types'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import ManifestImage from '@modules/extension/components/ManifestImage'
import { ConnectedSite } from '@web/background/services/permission'

import styles from './styles'

type Props = {
  name: ConnectedSite['name']
  origin: ConnectedSite['origin']
  isConnected: ConnectedSite['isConnected']
  disconnectDapp: AmbireExtensionContextReturnType['disconnectDapp']
  isLast: boolean
}

const ConnectedDAppItem = ({ name, origin, isConnected, disconnectDapp, isLast }: Props) => {
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(origin)}
      style={[styles.itemContainer, isLast && spacings.mb]}
    >
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <ManifestImage
            host={origin}
            size={34}
            fallback={() => <ManifestFallbackIcon width={34} height={34} />}
          />
          <View style={[flexboxStyles.flex1, spacings.plTy]}>
            <Text numberOfLines={1} style={[flexboxStyles.flex1, spacings.mrMi]}>
              {name}
            </Text>
            <Text fontSize={10} color={isConnected ? colors.turquoise : colors.pink}>
              {isConnected ? t('Connected') : t('Blocked')} ({origin})
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
