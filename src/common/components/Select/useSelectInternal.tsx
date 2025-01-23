import React, { useCallback, useEffect, useMemo, useState } from 'react'

import usePrevious from '@common/hooks/usePrevious'
import useSelect from '@common/hooks/useSelect'

import { MenuOption } from './components/MenuOption'
import { DEFAULT_SELECT_SIZE, SELECT_SIZE_TO_HEIGHT } from './styles'
import { SectionedSelectProps, SelectProps, SelectValue } from './types'

type Props = Pick<
  SelectProps,
  'menuOptionHeight' | 'setValue' | 'size' | 'attemptToFetchMoreOptions'
> &
  (
    | {
        value: SelectProps['value']
        data: SelectProps['options']
        isSectionList: false
      }
    | {
        value: SelectProps['value']
        data: SectionedSelectProps['sections']
        isSectionList: true
      }
  )

const useSelectInternal = ({
  menuOptionHeight,
  setValue,
  value,
  size = DEFAULT_SELECT_SIZE,
  data,
  isSectionList,
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

  const filteredData = useMemo(() => {
    if (!search) return data

    const normalizedSearchTerm = search.toLowerCase()

    const filterOptions = (options: SelectProps['options']) => {
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
          const isPartialMatch = fieldsToBeSearchedInto.some((f) =>
            f.includes(normalizedSearchTerm)
          )
          if (isExactMatch) {
            result.exactMatches.push(o)
          } else if (isPartialMatch) {
            result.partialMatches.push(o)
          }

          return result
        },
        { exactMatches: [] as SelectValue[], partialMatches: [] as SelectValue[] }
      )

      return { exactMatches, partialMatches }
    }

    if (isSectionList) {
      const sectionsWithFilteredData = data.map((section) => {
        const { exactMatches, partialMatches } = filterOptions(
          section.data as SelectProps['options']
        )

        return {
          ...section,
          data: [...exactMatches, ...partialMatches]
        }
      })
      const noMatchesFound = sectionsWithFilteredData.every((section) => section.data.length === 0)
      const isAnotherSearchTerm = search !== prevSearch
      const shouldAttemptToFetchMoreOptions =
        noMatchesFound && isAnotherSearchTerm && !!attemptToFetchMoreOptions
      if (shouldAttemptToFetchMoreOptions) attemptToFetchMoreOptions(search)

      return noMatchesFound ? [] : sectionsWithFilteredData
    }
    const { exactMatches, partialMatches } = filterOptions(data)

    const result = [...exactMatches, ...partialMatches]
    const isAnotherSearchTerm = search !== prevSearch
    const shouldAttemptToFetchMoreOptions =
      !result.length && isAnotherSearchTerm && attemptToFetchMoreOptions
    if (shouldAttemptToFetchMoreOptions) attemptToFetchMoreOptions(search)

    return result
  }, [data, isSectionList, search, attemptToFetchMoreOptions, prevSearch])

  const selectedItemIndex = useMemo(() => {
    let index: [number, number] | number | null = null
    if (isSectionList) {
      filteredData.forEach((section, idx) => {
        ;(section.data as SelectProps['options']).forEach((opt, i) => {
          if (opt.value === value.value && !index) index = [idx, i]
        })
      })
    } else {
      index = filteredData.findIndex((opt) => opt.value === value.value)
    }

    return index === -1 ? null : (index as [number, number] | number | null)
  }, [value, filteredData, isSectionList])

  const prevSelectedItemIndex = usePrevious(selectedItemIndex)

  const [highlightedItemIndex, setHighlightedItemIndex] = useState<
    [number, number] | number | null
  >(selectedItemIndex)

  useEffect(() => {
    if (prevSelectedItemIndex && !selectedItemIndex && highlightedItemIndex) {
      if (isSectionList) {
        setHighlightedItemIndex([0, 0])
      } else {
        setHighlightedItemIndex(0)
      }
    }
  }, [prevSelectedItemIndex, highlightedItemIndex, selectedItemIndex, isSectionList])

  useEffect(() => {
    if (!prevIsMenuOpen && isMenuOpen) {
      if (isSectionList) {
        setHighlightedItemIndex(
          // @ts-ignore
          selectedItemIndex[0] === 0 && selectedItemIndex[1] === 0 ? selectedItemIndex : null
        )
      } else {
        setHighlightedItemIndex(
          // @ts-ignore
          selectedItemIndex === 0 ? 0 : null
        )
      }
    }
  }, [prevIsMenuOpen, isMenuOpen, selectedItemIndex, isSectionList])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return

      try {
        if (e.key === 'ArrowDown') {
          if (isSectionList) {
            const [sectionIndex = 0, optionIndex = -1] = (highlightedItemIndex as [
              number,
              number
            ]) || [null, null]
            const sectionsLength = filteredData.length
            const optionsLength = filteredData[sectionIndex]?.data.length || 0

            if (sectionIndex === sectionsLength - 1 && optionIndex === optionsLength - 1) return

            for (let i = sectionIndex; i < sectionsLength; i++) {
              const options = filteredData[i].data as SelectProps['options']
              const startIndex = i === sectionIndex ? optionIndex + 1 : 0

              const nextOption = options.slice(startIndex).find((opt) => !opt.disabled)
              if (nextOption) {
                setHighlightedItemIndex([
                  i,
                  startIndex + options.slice(startIndex).indexOf(nextOption)
                ])
                return
              }
            }
          } else {
            const optionIndex = (highlightedItemIndex as number | null) ?? -1
            const options = filteredData as SelectProps['options']
            const nextOption = options.slice(optionIndex + 1).find((opt) => !opt.disabled)
            if (nextOption) {
              setHighlightedItemIndex(
                optionIndex + 1 + options.slice(optionIndex + 1).indexOf(nextOption)
              )
            }
          }
        }

        if (e.key === 'ArrowUp') {
          if (isSectionList) {
            const [sectionIndex, optionIndex] = (highlightedItemIndex || [0, 0]) as [number, number]

            if (sectionIndex === 0 && optionIndex === 0) return

            for (let i = sectionIndex; i >= 0; i--) {
              const options = filteredData[i].data as SelectProps['options']
              const startIndex = i === sectionIndex ? optionIndex - 1 : options.length - 1

              for (let j = startIndex; j >= 0; j--) {
                if (!options[j].disabled) {
                  setHighlightedItemIndex([i, j])
                  return
                }
              }
            }
          } else {
            const optionIndex = (highlightedItemIndex as number | null) || 0
            const options = [...filteredData] as SelectProps['options']
            const prevOption = options
              .reverse()
              .slice(filteredData.length - optionIndex)
              .find((opt) => !opt.disabled)
            if (prevOption) {
              setHighlightedItemIndex((filteredData as SelectProps['options']).indexOf(prevOption))
            }
          }
        }

        if (e.repeat) return

        if (e.key === 'Enter' && highlightedItemIndex !== null) {
          if (isSectionList) {
            const [sectionIdx, optionIdx] = highlightedItemIndex as [number, number]
            handleOptionSelect(
              (filteredData as SectionedSelectProps['sections'])[sectionIdx].data[optionIdx]
            )
          } else {
            handleOptionSelect(
              (filteredData as SelectProps['options'])[highlightedItemIndex as number]
            )
          }
        }

        if (e.key === 'Escape') setIsMenuOpen(false)
      } catch (error) {
        console.error(error)
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [
    isMenuOpen,
    highlightedItemIndex,
    filteredData,
    isSectionList,
    handleOptionSelect,
    setIsMenuOpen
  ])

  const handleSetHoverIn = useCallback((index: [number, number] | number) => {
    setHighlightedItemIndex(index)
  }, [])

  const handleSetHoverOut = useCallback(() => {
    setHighlightedItemIndex(null)
  }, [])

  const renderItem = useCallback(
    ({ item, index, section }: { item: SelectValue; index: number; section: Props['data'] }) => {
      let onHoverIn = () => handleSetHoverIn(index)
      let isHighlighted = false

      try {
        if (isSectionList) {
          const sectionIndex = filteredData?.findIndex((s) => s.title === (section as any)?.title)
          onHoverIn = () => handleSetHoverIn([sectionIndex, index])

          if (
            sectionIndex === (highlightedItemIndex as [number, number])[0] &&
            (highlightedItemIndex as [number, number])[1] === index
          ) {
            isHighlighted = true
          }
        } else {
          isHighlighted = highlightedItemIndex === index
        }
      } catch (error) {
        console.log(error)
      }
      return (
        <MenuOption
          item={item}
          height={menuOptionHeight}
          isSelected={item.value === value.value}
          isHighlighted={isHighlighted}
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
      handleSetHoverOut,
      filteredData,
      isSectionList
    ]
  )

  const keyExtractor = useCallback((item: SelectValue) => item.value.toString(), [])

  const getItemLayout = useCallback(
    (d: SelectValue[] | null | undefined, index: number) => ({
      length: optionHeight,
      offset: optionHeight * index,
      index
    }),
    [optionHeight]
  )

  return {
    ...useSelectReturnValue,
    filteredData,
    renderItem,
    keyExtractor,
    getItemLayout
  }
}

export default useSelectInternal
