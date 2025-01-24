import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
        headerHeight: undefined
      }
    | {
        value: SelectProps['value']
        data: SectionedSelectProps['sections']
        isSectionList: true
        headerHeight: number
      }
  )

const useSelectInternal = ({
  menuOptionHeight,
  setValue,
  value,
  size = DEFAULT_SELECT_SIZE,
  data,
  isSectionList,
  headerHeight = 0,
  attemptToFetchMoreOptions
}: Props) => {
  const useSelectReturnValue = useSelect()
  const { search, isMenuOpen, setIsMenuOpen, setSearch } = useSelectReturnValue
  const optionHeight = menuOptionHeight || SELECT_SIZE_TO_HEIGHT[size]
  const listRef: any = useRef(null)

  const [listHeight, setListHeight] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [highlightedItemOnMouseMoveEnabled, setHighlightedItemOnMouseMoveEnabled] = useState(true)

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
    if (selectedItemIndex === null) return
    if (!prevIsMenuOpen && isMenuOpen) {
      if (!highlightedItemOnMouseMoveEnabled) {
        setHighlightedItemOnMouseMoveEnabled(true)
      }

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
  }, [
    prevIsMenuOpen,
    isMenuOpen,
    selectedItemIndex,
    isSectionList,
    highlightedItemOnMouseMoveEnabled
  ])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return

      try {
        if (e.key === 'ArrowDown') {
          if (highlightedItemOnMouseMoveEnabled) setHighlightedItemOnMouseMoveEnabled(false)

          if (isSectionList) {
            const [sectionIndex = 0, optionIndex = -1] = (highlightedItemIndex as [
              number,
              number
            ]) || [0, 0]
            const sectionsLength = filteredData.length
            const optionsLength = filteredData[sectionIndex]?.data.length || 0

            if (sectionIndex === sectionsLength - 1 && optionIndex === optionsLength - 1) return

            for (let i = sectionIndex; i < sectionsLength; i++) {
              const options = filteredData[i].data as SelectProps['options']
              const startIndex = i === sectionIndex ? optionIndex + 1 : 0

              const nextOption = options.slice(startIndex).find((opt) => !opt.disabled)
              if (nextOption) {
                const nextIndex = [
                  i,
                  startIndex + options.slice(startIndex).indexOf(nextOption)
                ] as [number, number]
                setHighlightedItemIndex(nextIndex)

                let offset: number = 0
                data.forEach((section, sectionIdx) => {
                  if (sectionIdx < nextIndex[0]) {
                    offset += headerHeight
                    offset += section.data.length * optionHeight
                  }

                  if (sectionIdx === nextIndex[0]) {
                    offset += headerHeight
                    offset += (nextIndex[1] + 1) * optionHeight
                  }
                })

                if (scrollOffset + listHeight <= offset) {
                  listRef.current?.getScrollResponder()?.scrollTo({ x: 0, y: offset - listHeight })
                }
                if (offset <= optionHeight) {
                  listRef.current?.getScrollResponder()?.scrollTo({ x: 0, y: 0 })
                }

                return
              }
            }
          } else {
            const optionIndex = (highlightedItemIndex as number | null) ?? -1
            const options = filteredData as SelectProps['options']
            const nextOption = options.slice(optionIndex + 1).find((opt) => !opt.disabled)
            if (nextOption) {
              const nextIndex = optionIndex + 1 + options.slice(optionIndex + 1).indexOf(nextOption)
              setHighlightedItemIndex(nextIndex)

              const nextItemOffset = (nextIndex + 1) * optionHeight
              if (scrollOffset + listHeight <= nextItemOffset) {
                listRef.current?.scrollToOffset({ offset: nextItemOffset - listHeight })
              }
              if (nextItemOffset <= optionHeight) {
                listRef.current?.scrollToOffset({ offset: 0 })
              }
            }
          }
        }

        if (e.key === 'ArrowUp') {
          if (highlightedItemOnMouseMoveEnabled) setHighlightedItemOnMouseMoveEnabled(false)
          if (isSectionList) {
            const [sectionIndex, optionIndex] = (highlightedItemIndex || [0, 0]) as [number, number]

            if (sectionIndex === 0 && optionIndex === 0) return

            for (let i = sectionIndex; i >= 0; i--) {
              const options = filteredData[i].data as SelectProps['options']
              const startIndex = i === sectionIndex ? optionIndex - 1 : options.length - 1

              for (let j = startIndex; j >= 0; j--) {
                if (!options[j].disabled) {
                  const nextIndex = [i, j] as [number, number]
                  setHighlightedItemIndex(nextIndex)

                  let offset: number = 0
                  data.forEach((section, sectionIdx) => {
                    if (sectionIdx < nextIndex[0]) {
                      offset += headerHeight
                      offset += section.data.length * optionHeight
                    }

                    if (sectionIdx === nextIndex[0]) {
                      offset += headerHeight
                      offset += (nextIndex[1] + 1) * optionHeight
                    }
                  })

                  if (scrollOffset >= offset - optionHeight) {
                    listRef.current
                      ?.getScrollResponder()
                      ?.scrollTo({ x: 0, y: offset - optionHeight })
                  }
                  if (offset - optionHeight <= headerHeight) {
                    listRef.current?.getScrollResponder()?.scrollTo({ x: 0, y: 0 })
                  }
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
              const nextIndex = (filteredData as SelectProps['options']).indexOf(prevOption)
              setHighlightedItemIndex(nextIndex)

              const nextItemOffset = nextIndex * optionHeight
              if (scrollOffset >= nextItemOffset) {
                listRef.current?.scrollToOffset({ offset: nextItemOffset })
              }
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
    highlightedItemOnMouseMoveEnabled,
    isMenuOpen,
    highlightedItemIndex,
    filteredData,
    isSectionList,
    handleOptionSelect,
    setIsMenuOpen,
    data,
    optionHeight,
    listHeight,
    headerHeight,
    scrollOffset
  ])

  useEffect(() => {
    const handleMouseMove = () => {
      if (!highlightedItemOnMouseMoveEnabled) setHighlightedItemOnMouseMoveEnabled(true)
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [highlightedItemOnMouseMoveEnabled])

  const handleSetHoverIn = useCallback(
    (index: [number, number] | number) => {
      if (!highlightedItemOnMouseMoveEnabled) return
      setHighlightedItemIndex(index)
    },
    [highlightedItemOnMouseMoveEnabled]
  )

  const handleSetHoverOut = useCallback(() => {
    if (!highlightedItemOnMouseMoveEnabled) return
    setHighlightedItemIndex(null)
  }, [highlightedItemOnMouseMoveEnabled])

  const renderItem = useCallback(
    ({ item, index, section }: { item: SelectValue; index: number; section: Props['data'] }) => {
      let onHoverIn = () => handleSetHoverIn(index)
      let isHighlighted = false

      try {
        if (isSectionList) {
          const sectionIndex = filteredData?.findIndex((s) => s.title === (section as any)?.title)
          onHoverIn = () => handleSetHoverIn([sectionIndex, index])

          if (
            highlightedItemIndex &&
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

  const keyExtractor = useCallback((item: SelectValue) => item.key || item.value, [])

  const getItemLayout = useCallback(
    (d: SelectValue[] | null | undefined, index: number) => {
      return {
        length: optionHeight,
        offset: optionHeight * index,
        index
      }
    },
    [optionHeight]
  )

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y
    setScrollOffset(offsetY)
  }

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout
    setListHeight(height)
  }

  return {
    ...useSelectReturnValue,
    filteredData,
    listRef,
    renderItem,
    keyExtractor,
    getItemLayout,
    handleScroll,
    handleLayout
  }
}

export default useSelectInternal
