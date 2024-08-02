import React, { useCallback } from 'react'

import useSelect from '@common/hooks/useSelect'

import { MenuOption } from './components/MenuOption'
import { SelectProps, SelectValue } from './types'

type Props = Required<Pick<SelectProps, 'menuOptionHeight' | 'value'>> &
  Pick<SelectProps, 'setValue'>

const useSelectInternal = ({ menuOptionHeight, setValue, value }: Props) => {
  const useSelectReturnValue = useSelect()
  const { setIsMenuOpen, setSearch } = useSelectReturnValue

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

  return {
    ...useSelectReturnValue,
    renderItem,
    keyExtractor,
    getItemLayout
  }
}

export default useSelectInternal
