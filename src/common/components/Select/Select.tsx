/* eslint-disable react/prop-types */
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useSelect from '@common/hooks/useSelect'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

import MenuContainer from './MenuContainer'
import { MenuOption, Option } from './MenuOption'
import getStyles, { MENU_OPTION_HEIGHT } from './styles'
import { SelectProps, SelectValue } from './types'

const Select = ({
  label,
  setValue,
  value,
  options,
  placeholder,
  containerStyle,
  selectStyle,
  labelStyle,
  menuOptionHeight = MENU_OPTION_HEIGHT,
  menuStyle,
  disabled,
  withSearch = true
}: SelectProps) => {
  const { t } = useTranslation()
  const {
    selectRef,
    menuRef,
    isMenuOpen,
    setIsMenuOpen,
    control,
    search,
    setSearch,
    toggleMenu,
    menuProps
  } = useSelect()
  const { theme, styles } = useTheme(getStyles)

  const filteredOptions = useMemo(() => {
    if (!search) return options
    return options.filter((o) => {
      let found: boolean = o.value.toString().toLowerCase().includes(search.toLowerCase())
      if (!found && typeof o.label === 'string') {
        found = o.label.toLowerCase().includes(search.toLowerCase())
      }

      return found
    })
  }, [options, search])

  const handleOptionSelect = useCallback(
    (item: SelectValue) => {
      !!setValue && setValue(item)
      setIsMenuOpen(false)
      setSearch('search', '')
    },
    [setValue, setIsMenuOpen, setSearch]
  )

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item }: { item: SelectValue }) => (
      <MenuOption
        item={item}
        height={menuOptionHeight}
        isSelected={item.value === value.value}
        onPress={handleOptionSelect}
      />
    ),
    [value, menuOptionHeight, handleOptionSelect]
  )

  const keyExtractor = useCallback((item: SelectValue) => item.value.toString(), [])

  const getItemLayout = useCallback(
    (data: SelectValue[] | null | undefined, index: number) => ({
      length: menuOptionHeight,
      offset: menuOptionHeight * index,
      index
    }),
    [menuOptionHeight]
  )

  return (
    <View style={[styles.selectContainer, containerStyle]} testID="tokens-select">
      {!!label && (
        <Text
          appearance="secondaryText"
          fontSize={14}
          weight="regular"
          style={[spacings.mbMi, labelStyle]}
        >
          {label}
        </Text>
      )}
      <Pressable
        disabled={disabled}
        style={[
          styles.selectBorderWrapper,
          disabled && { opacity: 0.6 },
          isMenuOpen && { borderColor: theme.infoBackground }
        ]}
        onPress={toggleMenu}
      >
        <View
          ref={selectRef}
          style={[
            styles.select,
            { borderColor: isMenuOpen ? theme.primary : theme.secondaryBorder },
            selectStyle
          ]}
        >
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
            {!!value && <Option item={value} />}
            {!value && (
              <Text fontSize={14} appearance="secondaryText">
                {placeholder || t('Select...')}
              </Text>
            )}
          </View>
          {!!isMenuOpen && <UpArrowIcon />}
          {!isMenuOpen && <DownArrowIcon />}
        </View>
      </Pressable>
      {!!isMenuOpen && (
        <MenuContainer menuRef={menuRef} menuStyle={menuStyle} menuProps={menuProps}>
          {!!withSearch && menuProps.position === 'bottom' && (
            <Search
              placeholder={t('Search...')}
              autoFocus
              control={control}
              containerStyle={spacings.mb0}
              borderWrapperStyle={styles.searchBorderWrapperStyle}
              inputWrapperStyle={styles.bottomSearchInputWrapperStyle}
              leftIconStyle={spacings.pl}
            />
          )}
          <FlatList
            data={filteredOptions}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialNumToRender={15}
            windowSize={10}
            maxToRenderPerBatch={20}
            removeClippedSubviews
            getItemLayout={getItemLayout}
            ListEmptyComponent={
              <Text
                style={[spacings.pv, flexbox.flex1, text.center]}
                numberOfLines={1}
                appearance="secondaryText"
                fontSize={14}
              >
                {t('No items found')}
              </Text>
            }
          />
          {!!withSearch && menuProps.position === 'top' && (
            <Search
              placeholder={t('Search...')}
              autoFocus
              control={control}
              containerStyle={spacings.mb0}
              borderWrapperStyle={styles.searchBorderWrapperStyle}
              inputWrapperStyle={styles.topSearchInputWrapperStyle}
              leftIconStyle={spacings.pl}
            />
          )}
        </MenuContainer>
      )}
    </View>
  )
}

export default React.memo(Select)
