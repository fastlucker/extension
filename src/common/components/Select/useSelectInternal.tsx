import React, { useCallback, useEffect, useMemo, useState } from 'react'

import usePrevious from '@common/hooks/usePrevious'
import useSelect from '@common/hooks/useSelect'

import { MenuOption } from './components/MenuOption'
import { DEFAULT_SELECT_SIZE, SELECT_SIZE_TO_HEIGHT } from './styles'
import { SelectProps, SelectValue } from './types'

type Props = Required<Pick<SelectProps, 'value'>> &
  Pick<
    SelectProps,
    'menuOptionHeight' | 'setValue' | 'size' | 'options' | 'attemptToFetchMoreOptions'
  >

const useSelectInternal = ({
  menuOptionHeight,
  setValue,
  value,
  size = DEFAULT_SELECT_SIZE,
  options,
  attemptToFetchMoreOptions
}: Props) => {
  const useSelectReturnValue = useSelect()
  const { search, isMenuOpen, setIsMenuOpen, setSearch } = useSelectReturnValue
  const optionHeight = menuOptionHeight || SELECT_SIZE_TO_HEIGHT[size]

  const handleOptionSelect = useCallback(
    (item: SelectValue) => {
      !!setValue && setValue(item)
      setIsMenuOpen(false)
      setSearch('search', '')
    },
    [setValue, setIsMenuOpen, setSearch]
  )

  const prevSearch = usePrevious(search)
  const prevIsMenuOpen = usePrevious(isMenuOpen)

  const filteredOptions = useMemo(() => {
    if (!search) return options

    const normalizedSearchTerm = search.toLowerCase()
    const { exactMatches, partialMatches } = options.reduce(
      (result, o) => {
        const { value: optionValue, label, extraSearchProps } = o

        const fieldsToBeSearchedInto = [
          optionValue.toString().toLowerCase(),
          // In case the label is string, include it (could be any ReactNode)
          typeof label === 'string' ? label.toLowerCase() : '',
          ...(extraSearchProps
            ? Object.values(extraSearchProps).map((field: unknown) => String(field).toLowerCase())
            : [])
        ]

        // Prioritize exact matches, partial matches come after
        const isExactMatch = fieldsToBeSearchedInto.some((f) => f === normalizedSearchTerm)
        const isPartialMatch = fieldsToBeSearchedInto.some((f) => f.includes(normalizedSearchTerm))
        if (isExactMatch) {
          result.exactMatches.push(o)
        } else if (isPartialMatch) {
          result.partialMatches.push(o)
        }

        return result
      },
      { exactMatches: [] as SelectValue[], partialMatches: [] as SelectValue[] }
    )

    const result = [...exactMatches, ...partialMatches]
    const isAnotherSearchTerm = search !== prevSearch
    const shouldAttemptToFetchMoreOptions =
      !result.length && isAnotherSearchTerm && attemptToFetchMoreOptions
    if (shouldAttemptToFetchMoreOptions) attemptToFetchMoreOptions(search)

    return result
  }, [options, search, attemptToFetchMoreOptions, prevSearch])

  const selectedItemIndex = useMemo(() => {
    const index = filteredOptions.findIndex((opt) => opt.value === value.value)
    return index === -1 ? null : index
  }, [value, filteredOptions])

  const prevSelectedItemIndex = usePrevious(selectedItemIndex)

  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number | null>(selectedItemIndex)

  useEffect(() => {
    if (prevSelectedItemIndex && !selectedItemIndex && highlightedItemIndex) {
      setHighlightedItemIndex(0)
    }
  }, [prevSelectedItemIndex, highlightedItemIndex, selectedItemIndex])

  useEffect(() => {
    if (!prevIsMenuOpen && isMenuOpen) {
      setHighlightedItemIndex(selectedItemIndex)
    }
  }, [prevIsMenuOpen, isMenuOpen, selectedItemIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return

      if (e.key === 'ArrowDown')
        setHighlightedItemIndex((prev) => ((prev || 0) + 1) % filteredOptions.length)

      if (e.key === 'ArrowUp')
        setHighlightedItemIndex(
          (prev) => ((prev || 0) - 1 + filteredOptions.length) % filteredOptions.length
        )

      if (e.repeat) return

      if (e.key === 'Enter' && highlightedItemIndex !== null)
        handleOptionSelect(filteredOptions[highlightedItemIndex])

      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown, true)

    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isMenuOpen, highlightedItemIndex, filteredOptions, handleOptionSelect, setIsMenuOpen])

  const handleSetHoverIn = useCallback((index: number) => {
    setHighlightedItemIndex(index)
  }, [])

  const handleSetHoverOut = useCallback(() => {
    setHighlightedItemIndex(null)
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: SelectValue; index: number }) => {
      const onHoverIn = () => handleSetHoverIn(index)

      return (
        <MenuOption
          item={item}
          height={menuOptionHeight}
          isSelected={item.value === value.value}
          isHighlighted={highlightedItemIndex === index}
          onPress={handleOptionSelect}
          onHoverIn={onHoverIn}
          onHoverOut={handleSetHoverOut}
          disabled={!!item?.disabled}
          size={size}
        />
      )
    },
    [
      menuOptionHeight,
      value.value,
      handleOptionSelect,
      size,
      highlightedItemIndex,
      handleSetHoverIn,
      handleSetHoverOut
    ]
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
    filteredOptions,
    renderItem,
    keyExtractor,
    getItemLayout
  }
}

export default useSelectInternal
