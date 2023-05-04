import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'
import { SvgUri } from 'react-native-svg'

import CheckIcon from '@common/assets/svg/CheckIcon'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import SearchIcon from '@common/assets/svg/SearchIcon'
import SortIcon from '@common/assets/svg/SortIcon'
import BottomSheet from '@common/components/BottomSheet'
import FastImage from '@common/components/FastImage'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Input from '@common/components/Input'
import NetworkIcon from '@common/components/NetworkIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useNetwork from '@common/hooks/useNetwork'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useDapps from '@mobile/modules/web3/hooks/useDapps'

import styles from './styles'

const DappsCatalogScreen = () => {
  const { navigate } = useNavigation()
  const { network } = useNetwork()
  const { filteredCatalog, search, categories, categoryFilter, onSearchChange, onCategorySelect } =
    useDapps()
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState<boolean>(false)

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  useEffect(() => {
    if (filteredCatalog.length && !loaded) {
      setLoaded(true)
    }
  }, [filteredCatalog, loaded])

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
        onPress={() => {
          handleOpenDapp(item)
          Keyboard.dismiss()
        }}
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
          {item.networks.slice(0, 7).map((n: string, index: number, arr: string | any[]) => {
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
          {item.networks.length > 7 && (
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
      <View style={[spacings.ph, spacings.mb]}>
        <Title style={[text.center, spacings.pbSm]} numberOfLines={1}>
          {t('Web3 dApp Catalog')}
        </Title>
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <View style={[flexbox.flex1, spacings.prTy]}>
            <Input
              containerStyle={spacings.mb0}
              placeholder={t('Search filter')}
              onChangeText={onSearchChange}
              leftIcon={() => <SearchIcon />}
              value={search}
            />
          </View>
          <TouchableOpacity onPress={openBottomSheet as any}>
            <SortIcon />
          </TouchableOpacity>
        </View>
      </View>
      {!loaded && (
        <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
          <Spinner />
        </View>
      )}
      {!!loaded && (
        <Wrapper
          hasBottomTabNav
          type={WRAPPER_TYPES.FLAT_LIST}
          data={sortFiltered(filteredCatalog)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
        />
      )}
      <BottomSheet
        id="dapps-filter-bottom-sheet"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
      >
        <Title style={text.center}>{t('Filter dApps by')}</Title>
        <View style={spacings.pt}>
          {categories
            // will temporarily support only these 2 categories
            .filter((e) => e.name === 'all' || e.name === 'favorites')
            .map((category: any) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.filterItem,
                    categoryFilter?.name === category.name && { backgroundColor: colors.howl }
                  ]}
                  onPress={() => onCategorySelect(category)}
                >
                  <Text fontSize={16} style={text.capitalize}>
                    {category.name}
                  </Text>
                  {categoryFilter?.name === category.name && <CheckIcon />}
                </TouchableOpacity>
              )
            })}
        </View>
      </BottomSheet>
    </GradientBackgroundWrapper>
  )
}

export default DappsCatalogScreen
