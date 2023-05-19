import { DappManifestData } from 'ambire-common/src/hooks/useDapps'
import React, { useCallback } from 'react'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import { SvgUri } from 'react-native-svg'

import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import StarIcon from '@common/assets/svg/StarIcon'
import FastImage from '@common/components/FastImage'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import styles from './styles'

interface Props {
  id: DappManifestData['id']
  name: DappManifestData['name']
  description: DappManifestData['description']
  iconUrl: DappManifestData['iconUrl']
  isFilled: boolean
  isSupported: boolean
  onOpenDapp: (id: DappManifestData['id']) => void
  onToggleFavorite: (id: DappManifestData['id']) => void
  networks: DappManifestData['networks']
}

const DappCatalogListItem: React.FC<Props> = ({
  id,
  name,
  description,
  iconUrl,
  isFilled,
  isSupported,
  onOpenDapp,
  onToggleFavorite,
  networks = []
}) => {
  const handleOnOpenDapp = useCallback(() => {
    if (!isSupported) return

    onOpenDapp(id)
    !isWeb && Keyboard.dismiss()
  }, [id, isSupported, onOpenDapp])

  return (
    <TouchableOpacity
      style={[styles.catalogItem, !isSupported && styles.disabledItem]}
      // Do not use disabled prop on TouchableOpacity, because of the built-in
      // behavior that prevents touch events from propagating to its parent
      // components when it is disabled that prevents scrolling on FlatList
      // disabled={!isSupported}
      activeOpacity={isSupported ? 0.8 : 0.2}
      onPress={handleOnOpenDapp}
    >
      <View style={[flexbox.directionRow, spacings.mb]}>
        <View style={spacings.mrTy}>
          {iconUrl ? (
            iconUrl.endsWith('.svg') ? (
              <View style={[common.borderRadiusPrimary, common.hidden]}>
                <SvgUri width={46} height={46} uri={iconUrl} />
              </View>
            ) : (
              <FastImage style={styles.dappIcon as any} source={{ uri: iconUrl }} />
            )
          ) : (
            <ManifestFallbackIcon />
          )}
        </View>
        <View style={flexbox.flex1}>
          <View style={[flexbox.directionRow, flexbox.justifySpaceBetween]}>
            <Text
              fontSize={16}
              weight="medium"
              numberOfLines={1}
              style={[spacings.mbMi, flexbox.flex1, spacings.prSm]}
            >
              {name}
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 5 }}
              onPress={() => {
                onToggleFavorite(id)
                !isWeb && Keyboard.dismiss()
              }}
            >
              <StarIcon isFilled={isFilled} />
            </TouchableOpacity>
          </View>
          <Text color={colors.baileyBells} fontSize={12} numberOfLines={8}>
            {description}
          </Text>
        </View>
      </View>
      <View style={[flexbox.directionRow, flexbox.alignEnd]}>
        {networks.slice(0, 7).map((n: string, index: number, arr: string | any[]) => {
          return (
            <View
              style={[
                styles.networkIcon,
                { marginLeft: index ? -5 : 0, zIndex: arr.length - index }
              ]}
              key={n}
            >
              <NetworkIcon name={n as any} width={22} height={22} />
            </View>
          )
        })}
        {networks.length > 7 && (
          <Text
            style={[spacings.plMi, { height: 6, lineHeight: 14 }]}
            fontSize={28}
            color={colors.titan_50}
          >
            ...
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(DappCatalogListItem)
