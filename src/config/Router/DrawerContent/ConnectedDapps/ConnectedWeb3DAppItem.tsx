import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, TouchableOpacity, View } from 'react-native'

import DisconnectIcon from '@assets/svg/DisconnectIcon'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

type Props = {
  host: string
  status: boolean
  disconnect: (host: string) => void
  isLast: boolean
}

const ConnectedDAppItem = ({ host, status, disconnect, isLast }: Props) => {
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`https://${host}/`)}
      style={[styles.itemContainer, isLast && spacings.mb]}
    >
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <ManifestImage host={host} size={34} />
          <View style={[flexboxStyles.flex1, spacings.plTy]}>
            <Text numberOfLines={1} style={[flexboxStyles.flex1, spacings.mrMi]}>
              {host}
            </Text>
            <Text fontSize={10} color={status ? colors.turquoise : colors.pink}>
              {status ? t('Connected') : t('Blocked')}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => disconnect(host)}>
          <DisconnectIcon />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(ConnectedDAppItem)
