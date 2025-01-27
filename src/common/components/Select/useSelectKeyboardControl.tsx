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
  const highlightedItemOnMouseMoveEnabled = useRef(true)
  const scrollOffset = useRef(0)

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
      scrollOffset.current = 0
      setHighlightedItemIndex(selectedItemIndex === 0 ? 0 : null)
    }
  }, [prevIsMenuOpen, isMenuOpen, selectedItemIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return

      try {
        if (e.key === 'ArrowDown') {
          highlightedItemOnMouseMoveEnabled.current = false

          const optionIndex = highlightedItemIndex ?? -1
          const nextOption = options.slice(optionIndex + 1).find((opt) => !opt.disabled)
          if (nextOption) {
            const nextIndex = optionIndex + 1 + options.slice(optionIndex + 1).indexOf(nextOption)
            setHighlightedItemIndex(nextIndex)

            const nextItemOffset = (nextIndex + 1) * optionHeight

            if (scrollOffset.current + listHeight <= nextItemOffset) {
              listRef.current?.scrollToOffset({
                offset: nextItemOffset - listHeight,
                animated: false
              })
            }
            if (nextItemOffset <= optionHeight)
              listRef.current?.scrollToOffset({ offset: 0, animated: false })
          }
        }

        if (e.key === 'ArrowUp') {
          highlightedItemOnMouseMoveEnabled.current = false

          const optionIndex = highlightedItemIndex || 0

          const prevOption = [...options]
            .reverse()
            .slice(options.length - optionIndex)
            .find((opt) => !opt.disabled)
          if (prevOption) {
            const nextIndex = options.indexOf(prevOption)
            setHighlightedItemIndex(nextIndex)

            const nextItemOffset = nextIndex * optionHeight

            if (scrollOffset.current >= nextItemOffset) {
              listRef.current?.scrollToOffset({ offset: nextItemOffset, animated: false })
            }
          } else {
            setHighlightedItemIndex(0)
            listRef.current?.scrollToOffset({ offset: 0, animated: false })
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
    isMenuOpen,
    highlightedItemIndex,
    options,
    optionHeight,
    listHeight,
    handleOptionSelect,
    setIsMenuOpen
  ])

  useEffect(() => {
    const handleMouseMove = () => {
      if (!highlightedItemOnMouseMoveEnabled.current)
        highlightedItemOnMouseMoveEnabled.current = true
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSetHoverIn = useCallback((index: number) => {
    if (!highlightedItemOnMouseMoveEnabled.current) return
    setHighlightedItemIndex(index)
  }, [])

  const handleSetHoverOut = useCallback(() => {
    if (!highlightedItemOnMouseMoveEnabled.current) return
    setHighlightedItemIndex(null)
  }, [])

  const renderItem = ({ item, index }: { item: SelectValue; index: number }) => (
    <MenuOption
      item={item}
      index={index}
      height={optionHeight}
      isSelected={item.value === value.value}
      isHighlighted={highlightedItemIndex === index}
      onPress={handleOptionSelect}
      onHoverIn={handleSetHoverIn}
      onHoverOut={handleSetHoverOut}
      disabled={!!item?.disabled}
      size={size}
    />
  )

  const handleScroll = (event: any) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y
  }

  return { listRef, renderItem, handleScroll }
}

export default useSelectKeyboardControl
