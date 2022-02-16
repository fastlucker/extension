import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, TouchableOpacity, View } from 'react-native'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import Button, { BUTTON_SIZES, BUTTON_TYPES } from '@modules/common/components/Button'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const ConnectedDapps = () => {
  const { connections, disconnect } = useWalletConnect()
  const { t } = useTranslation()
  const isLegacyWC = ({ bridge }: any) => /https:\/\/bridge.walletconnect.org/g.test(bridge)

  if (!connections.length) {
    return null
  }

  return (
    <Panel>
      <Title>{t('Connected dApps')}</Title>
      {connections.map(({ session, uri, isOffline }: any, i: number) => {
        const icon = session?.peerMeta?.icons?.filter((x: any) => !x?.endsWith('favicon.ico'))[0]

        return (
          <TouchableOpacity
            key={session.key}
            style={[
              flexboxStyles.directionRow,
              flexboxStyles.alignCenter,
              i === connections.length - 1 ? spacings.mb0 : spacings.mb
            ]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(session.peerMeta.url)}
          >
            {icon ? (
              <Image source={{ uri: icon }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="broken-image" size={15} color={colors.primaryIconColor} />
              </View>
            )}
            <View>
              {isLegacyWC(session) && (
                // TODO: needs appropriate icon
                <MaterialIcons
                  name="warning"
                  size={12}
                  color={colors.dangerColor}
                  style={spacings.mrTy}
                />
              )}
              {!!isOffline && (
                // TODO: needs appropriate icon
                <FontAwesome
                  name="warning"
                  size={12}
                  color={colors.dangerColor}
                  style={spacings.mrTy}
                />
              )}
            </View>
            <View style={[flexboxStyles.flex1, spacings.prTy]}>
              <Text numberOfLines={1}>{session.peerMeta.name}</Text>
            </View>
            <View>
              <Button
                size={BUTTON_SIZES.SMALL}
                type={BUTTON_TYPES.OUTLINE}
                hitSlop={{ bottom: 10, top: 10, left: 5, right: 5 }}
                text={t('Disconnect')}
                textStyle={{ fontSize: 11 }}
                hasBottomSpacing={false}
                onPress={() => disconnect(uri)}
              />
            </View>
          </TouchableOpacity>
        )
      })}
    </Panel>
  )
}

export default ConnectedDapps
