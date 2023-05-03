import React, { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SvgUri } from 'react-native-svg'

import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import FastImage from '@common/components/FastImage'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useNetwork from '@common/hooks/useNetwork'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useDapps from '@mobile/modules/web3/hooks/useDapps'

import styles from './styles'

const DappsCatalogScreen = () => {
  const { navigate } = useNavigation()
  const { network } = useNetwork()
  const { filteredCatalog } = useDapps()

  const handleOpenDapp = useCallback(
    async (item: any) => {
      navigate(`${ROUTES.web3Browser}-screen`, {
        state: {
          selectedDappUrl: item.url
        }
      })
    },
    [navigate]
  )

  const sortFiltered = useCallback(
    (filteredItems: any) => {
      return filteredItems
        .map((item: any) => {
          return {
            ...item,
            supported:
              !item.networks?.length ||
              !!item.networks?.find((supported: any) => supported === network?.id)
          }
        })
        .sort((a: any, b: any) => {
          return b.supported - a.supported
        })
    },
    [network]
  )

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.catalogItem}
        activeOpacity={0.8}
        onPress={() => handleOpenDapp(item)}
      >
        <View style={[flexbox.directionRow, spacings.mb]}>
          <View style={spacings.mrTy}>
            {item.iconUrl ? (
              item.iconUrl.endsWith('.svg') ? (
                <View style={[common.borderRadiusPrimary, common.hidden]}>
                  <SvgUri width={46} height={46} uri={item.iconUrl} />
                </View>
              ) : (
                <FastImage style={styles.dappIcon as any} source={{ uri: item.iconUrl }} />
              )
            ) : (
              <ManifestFallbackIcon />
            )}
          </View>
          <View style={flexbox.flex1}>
            <Text fontSize={16} weight="medium" numberOfLines={1} style={spacings.mbMi}>
              {item.name}
            </Text>
            <Text color={colors.baileyBells} fontSize={12} numberOfLines={8}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={[flexbox.directionRow, flexbox.alignEnd]}>
          {item.networks.slice(0, 8).map((n: string, index: number, arr: string | any[]) => {
            return (
              <View
                style={[
                  styles.networkIcon,
                  { marginLeft: index ? -5 : 0, zIndex: arr.length - index }
                ]}
              >
                <NetworkIcon name={n as any} width={22} height={22} />
              </View>
            )
          })}
          {item.networks.length > 8 && (
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

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        hasBottomTabNav
        type={WRAPPER_TYPES.FLAT_LIST}
        data={sortFiltered(filteredCatalog)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </GradientBackgroundWrapper>
  )
}

export default DappsCatalogScreen
