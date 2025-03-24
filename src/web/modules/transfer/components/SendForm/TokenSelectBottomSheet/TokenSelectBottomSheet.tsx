import React, { memo, ReactNode, useCallback, useRef, useState } from 'react'
import { FlatList, TextStyle, View, ViewStyle } from 'react-native'
import { useModalize } from 'react-native-modalize'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import SelectedMenuOption from '@common/components/Select/components/SelectedMenuOption'
import { SectionedSelectProps, SelectValue } from '@common/components/Select/types'
import { DEFAULT_SELECT_SIZE } from '@common/components/Select/styles'
import useSelectInternal from '@common/components/Select/useSelectInternal'
import EmptyListPlaceholder from '@common/components/Select/components/EmptyListPlaceholder'
import getStyles from './styles'

interface Props {
  setValue?: (value: SelectValue) => void
  containerStyle?: ViewStyle
  testID?: string
  labelStyle?: TextStyle
  selectStyle?: ViewStyle
  label?: string | ReactNode
  disabled?: boolean
  value?: SelectValue | null
  options: SelectValue[]
  placeholder?: string
  size?: 'sm' | 'md'
  emptyListPlaceholderText?: string
}

const TokenSelectBottomSheet = ({
  setValue,
  containerStyle,
  labelStyle,
  label,
  disabled,
  value,
  options,
  selectStyle,
  placeholder,
  size = DEFAULT_SELECT_SIZE,
  testID,
  emptyListPlaceholderText
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { ref: sheetRef, open: openSheet, close: closeSheetRef } = useModalize()
  const selectRef: React.MutableRefObject<any> = useRef(null)
  const { styles } = useTheme(getStyles)

  const selectData = useSelectInternal({
    value,
    setValue,
    // To address the structural differences between SectionList and FlatList,
    // we wrap non-sectioned list data in a default single section
    data: [{ data: options, title: '', key: 'default' }] as SectionedSelectProps['sections']
  })
  const {
    listRef,
    filteredData,
    renderItem,
    keyExtractor,
    getItemLayout,
    handleLayout,
    handleScroll
  } = selectData

  const handleOpenSheet = useCallback(() => {
    openSheet()
    setIsOpen(true)
  }, [openSheet])

  const handleCloseSheet = useCallback(() => {
    closeSheetRef()
    setIsOpen(false)
  }, [openSheet])

  return (
    <View>
      <View style={[styles.selectContainer, containerStyle]} testID={testID}>
        <Text
          appearance="secondaryText"
          fontSize={14}
          weight="regular"
          style={[spacings.mbMi, labelStyle]}
        >
          {label}
        </Text>
        <SelectedMenuOption
          disabled={disabled}
          isMenuOpen={isOpen}
          selectRef={selectRef}
          toggleMenu={handleOpenSheet}
          value={value}
          placeholder={placeholder}
          selectStyle={selectStyle}
          size={size}
        />
      </View>
      <BottomSheet id="tokens-list" sheetRef={sheetRef} closeBottomSheet={handleCloseSheet}>
        <View style={[{ maxHeight: 400 }]}>
          <br />
          <FlatList
            ref={listRef}
            // get the data (the options) from the default section
            data={filteredData?.[0]?.data || []}
            renderItem={renderItem as any}
            keyExtractor={keyExtractor}
            onLayout={handleLayout}
            initialNumToRender={15}
            windowSize={10}
            maxToRenderPerBatch={20}
            removeClippedSubviews
            getItemLayout={getItemLayout}
            ListEmptyComponent={<EmptyListPlaceholder placeholderText={emptyListPlaceholderText} />}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </View>
      </BottomSheet>
    </View>
  )
}

export default memo(TokenSelectBottomSheet)
