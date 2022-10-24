import React, { useMemo, useState } from 'react'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import CheckIcon from '@assets/svg/CheckIcon'
import DownArrowIcon from '@assets/svg/DownArrowIcon'
import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Input from '@modules/common/components/Input'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

interface Props {
  value: string | null
  items: any[]
  setValue?: (value: any) => void
  label?: string
  extraText?: string
}

const Select = ({ value, setValue, items, label, extraText }: Props) => {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const item = useMemo(() => items?.find((i) => i.value === value), [value, items])

  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((i: any) => i?.label?.toLowerCase().includes(searchValue.toLowerCase()))
        : items,
    [items, searchValue]
  )

  const renderItem = ({ item }: any) => {
    const onSelect = () => {
      !!setValue && setValue(item.value)
      closeBottomSheet()
    }

    return (
      <TouchableOpacity
        style={[
          flexboxStyles.directionRow,
          flexboxStyles.alignCenter,
          spacings.phTy,
          spacings.pvMi,
          commonStyles.borderRadiusPrimary,
          { backgroundColor: item.value === value ? colors.howl : 'transparent' }
        ]}
        activeOpacity={0.6}
        onPress={onSelect}
      >
        {!!item.icon && item.icon()}
        <View style={[flexboxStyles.flex1, spacings.phTy]}>
          <Text style={flexboxStyles.flex1} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
        {item.value === value && <CheckIcon />}
      </TouchableOpacity>
    )
  }

  return (
    <>
      {!!label && <Text style={spacings.mbMi}>{label}</Text>}
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss()
          openBottomSheet()
        }}
      >
        <View pointerEvents="none">
          <Input
            value={item?.label}
            leftIcon={item?.icon}
            containerStyle={spacings.mbSm}
            button={
              <View pointerEvents="none">
                {!!extraText && (
                  <View style={styles.extra}>
                    <Text fontSize={12} color={colors.heliotrope}>
                      {extraText}
                    </Text>
                  </View>
                )}
                <NavIconWrapper onPress={() => null}>
                  <DownArrowIcon width={34} height={34} />
                </NavIconWrapper>
              </View>
            }
          />
        </View>
      </TouchableOpacity>
      <BottomSheet
        id="select-bottom-sheet"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        displayCancel={false}
        flatListProps={{
          data: filteredItems || [],
          renderItem,
          keyExtractor: (i: any, idx: number) => `${i.value}-${idx}`,
          ListEmptyComponent: (
            <View style={[spacings.ptLg, flexboxStyles.alignCenter]}>
              <Text style={textStyles.center}>{t('No tokens were found.')}</Text>
            </View>
          ),
          ListHeaderComponent: (
            <View style={[spacings.pbSm, { backgroundColor: colors.clay }]}>
              <Input
                value={searchValue}
                containerStyle={spacings.mb0}
                onChangeText={setSearchValue}
                placeholder={t('Search...')}
              />
            </View>
          ),
          stickyHeaderIndices: [0]
        }}
      />
    </>
  )
}

export default React.memo(Select)
