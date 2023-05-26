import React from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import CheckIcon from '@common/assets/svg/CheckIcon'
import CloseIconRound from '@common/assets/svg/CloseIconRound'
import SearchIcon from '@common/assets/svg/SearchIcon'
import SortIcon from '@common/assets/svg/SortIcon'
import BottomSheet from '@common/components/BottomSheet'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import DappsCatalogList from '@mobile/modules/web3/components/DappsCatalogList'
import useDapps from '@mobile/modules/web3/hooks/useDapps'

import styles from './styles'

const DappsCatalogScreen = () => {
  const { search, categories, categoryFilter, onSearchChange, onCategorySelect } = useDapps()
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  return (
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          !isWeb && Keyboard.dismiss()
        }}
      >
        <View style={flexbox.flex1}>
          <View style={[spacings.ph, spacings.mb]}>
            <Title type="small" style={spacings.pbSm} numberOfLines={1}>
              {t('Web3 dApp Catalog')}
            </Title>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <View style={[flexbox.flex1, spacings.prTy]}>
                <Input
                  containerStyle={spacings.mb0}
                  placeholder={t('Search filter')}
                  onChangeText={onSearchChange}
                  leftIcon={() => <SearchIcon />}
                  button={<CloseIconRound color={!search ? colors.titan_50 : colors.titan} />}
                  buttonProps={{
                    onPress: () => onSearchChange(''),
                    disabled: !search
                  }}
                  value={search}
                />
              </View>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 10, left: 5 }}
                onPress={() => {
                  openBottomSheet()
                  !isWeb && Keyboard.dismiss()
                }}
              >
                <SortIcon />
              </TouchableOpacity>
            </View>
          </View>
          <DappsCatalogList />
          <BottomSheet
            id="dapps-filter-bottom-sheet"
            sheetRef={sheetRef}
            closeBottomSheet={closeBottomSheet}
          >
            <Title style={text.center}>{t('Filter dApps by')}</Title>
            <View style={[spacings.pt, spacings.pbMd]}>
              {categories
                // will temporarily support only these 2 categories
                .filter((e) => e.name === 'all' || e.name === 'favorites')
                .map((category: any) => {
                  return (
                    <TouchableOpacity
                      key={category.name}
                      onPress={() => onCategorySelect(category)}
                      style={[
                        styles.filterItem,
                        categoryFilter?.name === category.name && { backgroundColor: colors.howl }
                      ]}
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
        </View>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default DappsCatalogScreen
