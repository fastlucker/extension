import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import BackButton from '@common/components/BackButton'
import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings, { SPACING_MI, SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  TabLayoutContainer,
  tabLayoutWidths
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { Dapp } from '@web/extension-services/background/controllers/dapps'
import useDappsControllerState from '@web/hooks/useDappsControllerState'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import DappItem from '@web/modules/dapp-catalog/components/DappItem'

import getStyles from './styles'

type FilterButtonType = {
  value: 'all' | 'favorites' | 'connected'
  active?: boolean
  onPress: (type: 'all' | 'favorites' | 'connected') => void
  style?: ViewStyle
}

const FilterButton = React.memo(({ value, active, style, onPress }: FilterButtonType) => {
  const { styles, theme } = useTheme(getStyles)

  const buttonColors = useMemo(
    () => ({
      filterButton: [
        {
          property: 'borderColor',
          from: theme.secondaryBorder,
          to: theme.primary
        }
      ]
    }),
    [theme]
  )

  const [bind, animatedStyle] = useMultiHover({
    values: buttonColors.filterButton as any
  })

  return (
    <AnimatedPressable
      {...bind}
      style={[
        styles.filterButton,
        animatedStyle,
        active && styles.filterButtonHovered,
        active && styles.filterButtonActive,
        style
      ]}
      onPress={() => onPress(value)}
    >
      {({ hovered }: any) => (
        <Text fontSize={14} color={active ? '#FFF' : hovered ? theme.primary : theme.secondaryText}>
          {value}
        </Text>
      )}
    </AnimatedPressable>
  )
})

const DappCatalogScreen = () => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: ''
    }
  })

  const { t } = useTranslation()
  const { state, getIsDappConnected } = useDappsControllerState()
  const [predefinedFilter, setPredefinedFilter] = useState<
    'all' | 'favorites' | 'connected' | null
  >(null)

  const search = watch('search')

  const filteredDapps = useMemo(() => {
    const allDapps = state.dapps
    if (search.length) {
      if (predefinedFilter) setPredefinedFilter(null)
      return allDapps.filter((dapp) => dapp.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (!predefinedFilter) setPredefinedFilter('all')
    if (predefinedFilter === 'favorites') return allDapps.filter((dapp) => !!dapp.favorite)
    if (predefinedFilter === 'connected')
      return allDapps.filter((dapp) => getIsDappConnected(dapp.url))

    return allDapps
  }, [search, state.dapps, predefinedFilter, getIsDappConnected])

  const handleSelectPredefinedFilter = useCallback((type: 'all' | 'favorites' | 'connected') => {
    setPredefinedFilter(type)
  }, [])

  const renderItem = ({ item }: { item: Dapp }) => (
    <DappItem isConnected={getIsDappConnected(item.url)} {...item} />
  )

  return (
    <TabLayoutContainer
      hideFooterInPopup
      width="xl"
      footer={<BackButton />}
      footerStyle={{ maxWidth: tabLayoutWidths.xl }}
      header={<Header withPopupBackButton mode="title" withAmbireLogo />}
      style={spacings.ph0}
      withHorizontalPadding={false}
    >
      <View style={[flexbox.flex1]}>
        <View style={[spacings.phSm, spacings.pvSm]}>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <View style={[flexbox.flex1, spacings.mr]}>
              <Search placeholder="Search for dApp" control={control} setValue={setValue} />
            </View>
            <FilterButton
              value="all"
              active={predefinedFilter === 'all'}
              style={spacings.mrTy}
              onPress={handleSelectPredefinedFilter}
            />
            <FilterButton
              value="favorites"
              active={predefinedFilter === 'favorites'}
              style={spacings.mrTy}
              onPress={handleSelectPredefinedFilter}
            />
            <FilterButton
              value="connected"
              active={predefinedFilter === 'connected'}
              onPress={handleSelectPredefinedFilter}
            />
          </View>
        </View>
        <ScrollableWrapper
          type={WRAPPER_TYPES.FLAT_LIST}
          contentContainerStyle={[
            spacings.plTy,
            spacings.pbTy,
            { paddingRight: SPACING_TY - SPACING_MI / 2, marginTop: -SPACING_MI }
          ]}
          numColumns={3}
          data={filteredDapps}
          renderItem={renderItem}
          keyExtractor={(item: Dapp) => item.id}
          ListEmptyComponent={
            <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
              <Text style={text.center}>{t('No dApp found')}</Text>
            </View>
          }
        />
      </View>
    </TabLayoutContainer>
  )
}

export default React.memo(DappCatalogScreen)
