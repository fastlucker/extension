import React, { useCallback } from 'react'

import useSelect from '@common/hooks/useSelect'

import { MenuOption } from './components/MenuOption'
import { DEFAULT_SELECT_SIZE, SELECT_SIZE_TO_HEIGHT } from './styles'
import { SelectProps, SelectValue } from './types'

type Props = Required<Pick<SelectProps, 'value'>> &
  Pick<SelectProps, 'menuOptionHeight' | 'setValue' | 'size'>

const useSelectInternal = ({
  menuOptionHeight,
  setValue,
  value,
  size = DEFAULT_SELECT_SIZE
}: Props) => {
  const useSelectReturnValue = useSelect()
  const { setIsMenuOpen, setSearch } = useSelectReturnValue
  const optionHeight = menuOptionHeight || SELECT_SIZE_TO_HEIGHT[size]

  const handleOptionSelect = useCallback(
    (item: SelectValue) => {
      !!setValue && setValue(item)
      setIsMenuOpen(false)
      setSearch('search', '')
    },
    [setValue, setIsMenuOpen, setSearch]
  )

  const renderItem = useCallback(
    ({ item }: { item: SelectValue }) => (
      <MenuOption
        item={item}
        height={menuOptionHeight}
        isSelected={item.value === value.value}
        onPress={handleOptionSelect}
        disabled={!!item?.disabled}
        size={size}
      />
    ),
    [menuOptionHeight, value.value, handleOptionSelect, size]
  )

  const keyExtractor = useCallback((item: SelectValue) => item.value.toString(), [])

  const getItemLayout = useCallback(
    (data: SelectValue[] | null | undefined, index: number) => ({
      length: optionHeight,
      offset: optionHeight * index,
      index
    }),
    [optionHeight]
  )

  return {
    ...useSelectReturnValue,
    renderItem,
    keyExtractor,
    getItemLayout
  }
}

export default useSelectInternal
