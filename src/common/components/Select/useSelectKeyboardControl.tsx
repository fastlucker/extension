import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import usePrevious from '@common/hooks/usePrevious'

import { MenuOption } from './components/MenuOption'
import { SelectProps, SelectValue } from './types'

type Props = {
  listHeight: number
  optionHeight: number
  options: SelectProps['options']
  value: SelectProps['value']
  size: SelectProps['size']
  isMenuOpen: boolean
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleOptionSelect: (item: SelectValue) => void
}

const useSelectKeyboardControl = ({
  listHeight = 0,
  optionHeight,
  options,
  value,
  size,
  isMenuOpen,
  setIsMenuOpen,
  handleOptionSelect
}: Props) => {
  const listRef: any = useRef(null)

  const [scrollOffset, setScrollOffset] = useState(0)
  const [highlightedItemOnMouseMoveEnabled, setHighlightedItemOnMouseMoveEnabled] = useState(true)

  const prevIsMenuOpen = usePrevious(isMenuOpen)

  const selectedItemIndex = useMemo(() => {
    const index = options.findIndex((opt) => opt.value === value.value)
    return index === -1 ? null : index
  }, [value, options])

  const prevSelectedItemIndex = usePrevious(selectedItemIndex)

  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number | null>(selectedItemIndex)

  useEffect(() => {
    if (prevSelectedItemIndex && !selectedItemIndex && highlightedItemIndex)
      setHighlightedItemIndex(0)
  }, [prevSelectedItemIndex, highlightedItemIndex, selectedItemIndex])

  useEffect(() => {
    if (selectedItemIndex === null) return
    if (!prevIsMenuOpen && isMenuOpen) {
      if (!highlightedItemOnMouseMoveEnabled) {
        setHighlightedItemOnMouseMoveEnabled(true)
      }

      setHighlightedItemIndex(selectedItemIndex === 0 ? 0 : null)
    }
  }, [prevIsMenuOpen, isMenuOpen, selectedItemIndex, highlightedItemOnMouseMoveEnabled])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return

      try {
        if (e.key === 'ArrowDown') {
          if (highlightedItemOnMouseMoveEnabled) setHighlightedItemOnMouseMoveEnabled(false)

          const optionIndex = highlightedItemIndex ?? -1
          const nextOption = options.slice(optionIndex + 1).find((opt) => !opt.disabled)
          if (nextOption) {
            const nextIndex = optionIndex + 1 + options.slice(optionIndex + 1).indexOf(nextOption)
            setHighlightedItemIndex(nextIndex)

            const nextItemOffset = (nextIndex + 1) * optionHeight
            if (scrollOffset + listHeight <= nextItemOffset) {
              listRef.current?.scrollToOffset({ offset: nextItemOffset - listHeight })
            }
            if (nextItemOffset <= optionHeight) listRef.current?.scrollToOffset({ offset: 0 })
          }
        }

        if (e.key === 'ArrowUp') {
          if (highlightedItemOnMouseMoveEnabled) setHighlightedItemOnMouseMoveEnabled(false)

          const optionIndex = highlightedItemIndex || 0

          const prevOption = [...options]
            .reverse()
            .slice(options.length - optionIndex)
            .find((opt) => !opt.disabled)
          if (prevOption) {
            const nextIndex = options.indexOf(prevOption)
            setHighlightedItemIndex(nextIndex)

            const nextItemOffset = nextIndex * optionHeight
            if (scrollOffset >= nextItemOffset) {
              listRef.current?.scrollToOffset({ offset: nextItemOffset })
            }
          }
        }

        if (e.repeat) return

        if (e.key === 'Enter' && highlightedItemIndex !== null) {
          handleOptionSelect(options[highlightedItemIndex])
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
    options,
    optionHeight,
    listHeight,
    scrollOffset,
    handleOptionSelect,
    setIsMenuOpen
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
    (index: number) => {
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
    ({ item, index }: { item: SelectValue; index: number }) => {
      const onHoverIn = () => handleSetHoverIn(index)

      return (
        <MenuOption
          item={item}
          height={optionHeight}
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
      value,
      handleOptionSelect,
      size,
      highlightedItemIndex,
      handleSetHoverIn,
      handleSetHoverOut,
      optionHeight
    ]
  )

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y
    setScrollOffset(offsetY)
  }

  return { listRef, renderItem, handleScroll }
}

export default useSelectKeyboardControl
