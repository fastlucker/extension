/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useElementSize from '@common/hooks/useElementSize'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import { Portal } from '@gorhom/portal'

import { MenuOption, Option } from './MenuOption'
import getStyles, { MAX_MENU_HEIGHT, MENU_OPTION_HEIGHT } from './styles'
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
  const selectRef = useRef(null)
  const menuRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { control, watch, setValue: setSearchValue } = useForm({ defaultValues: { search: '' } })
  const { x, y, height, width, forceUpdate } = useElementSize(selectRef)
  const { height: windowHeight } = useWindowSize()
  const { theme, styles } = useTheme(getStyles)

  const search = watch('search')

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

  // close menu on click outside
  useEffect(() => {
    if (!isWeb) return
    function handleClickOutside(event: MouseEvent) {
      if (!isMenuOpen) return
      // @ts-ignore
      if (menuRef.current && !menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
        setSearchValue('search', '')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      if (!isWeb) return
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, setSearchValue])

  const handleOptionSelect = useCallback(
    (item: SelectValue) => {
      !!setValue && setValue(item)
      setIsMenuOpen(false)
      setSearchValue('search', '')
    },
    [setValue, setSearchValue]
  )

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item }: { item: SelectValue }) => (
      <MenuOption
        item={item}
        isSelected={item.value === value.value}
        onPress={handleOptionSelect}
      />
    ),
    [value, handleOptionSelect]
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

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen(true)
    forceUpdate() // calculate menu position
  }, [forceUpdate])

  const menuPosition = useMemo(() => {
    if (!!isMenuOpen && y + height + MAX_MENU_HEIGHT > windowHeight && y - MAX_MENU_HEIGHT > 0)
      return 'top'

    return 'bottom'
  }, [height, isMenuOpen, windowHeight, y])

  const maxMenuDynamicHeight = useMemo(() => {
    if (menuPosition === 'bottom' && y + height + MAX_MENU_HEIGHT > windowHeight) {
      return windowHeight - (y + height) - SPACING
    }

    return MAX_MENU_HEIGHT
  }, [height, menuPosition, windowHeight, y])

  return (
    <View style={[styles.selectContainer, containerStyle]}>
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
        style={[styles.selectBorderWrapper, isMenuOpen && { borderColor: theme.infoBackground }]}
        onPress={handleOpenMenu}
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
        <Portal hostName="global">
          <View
            ref={menuRef}
            style={[
              styles.menuContainer,
              { width, maxHeight: maxMenuDynamicHeight, left: x },
              menuPosition === 'bottom' && { top: y + height },
              menuPosition === 'top' && { bottom: windowHeight - y },
              menuStyle
            ]}
          >
            {!!withSearch && menuPosition === 'bottom' && (
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
            {!!withSearch && menuPosition === 'top' && (
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
          </View>
        </Portal>
      )}
    </View>
  )
}

export default React.memo(Select)
